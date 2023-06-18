import { Component } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import 'mapbox-gl/dist/mapbox-gl.css';
import { withStore, createStore } from 'justorm/react';

import { Container, Button, NotificationsStore } from '@homecode/ui';
import { Icon } from 'components/UI/Icon/Icon';

import * as MARKERS from './markers';

import S from './MapBox.styl';
import { buildTypeId } from 'store/map/map.helpers';

const CONTAINER_ID = 'app-map';

type Props = {
  store?: any;
  className?: string;
};

@withStore({
  user: ['id'],
  map: ['isGeolocating', 'isPicking', 'markers', 'selected'],
  // page: ['isPanelVisible'],
  router: [],
})
class MapBox extends Component<Props> {
  map;
  store;

  constructor(props) {
    super(props);
    this.store = createStore(this, {
      isGeolocating: false,
    });
  }

  componentDidMount() {
    this.map = this.props.store.map.init(CONTAINER_ID);
    this.map.on('load', this.onMapLoad);
  }

  requestLocation(params?) {
    this.store.isGeolocating = true;
    navigator.geolocation.getCurrentPosition(
      e => this.onGeolocationSuccess(e, params),
      this.onGeolocationError
    );
  }

  onMapLoad = () => this.requestLocation();

  onGeolocationClick = () => {
    this.requestLocation({ fly: true });
  };

  onGeolocationSuccess = (e, { fly } = {}) => {
    const { user, map } = this.props.store;
    const { longitude, latitude } = e.coords;

    const type = 'users';
    const { id } = user;
    const coords = [longitude, latitude];

    if (map.markers.user?.[id]) {
      map.setMarketCoords(type, id, coords);
    } else {
      map.addMarker(type, id, coords);
    }

    if (fly) map.setSelected(type, id);

    this.store.isGeolocating = false;
  };

  onGeolocationError = () => {
    this.store.isGeolocating = false;
    NotificationsStore.show({
      type: 'warn',
      title: 'Геолокация недоступна',
      content:
        'Включите геолокацию что бы определить ваше местоположение на карте',
    });
  };

  onMarkerClick(type, id, e) {
    const { map, router, page } = this.props.store;

    e.stopPropagation();
    // const params = this.store.markers[id];
    // const { type } = params;
    // map.setSelected(type, id);

    router.go(`/${type}/${id}`);
    // if (type === 'me') router.go(`/user/${user.id}`);
    // else router.go(`/object/${id}`);

    page.showPanel();
  }

  renderMarkers() {
    const { map } = this.props.store;

    return Object.values(map.markers).map(items =>
      Object.entries(items).map(([id, params]) => {
        const { type } = params;
        const markerDOMId = map.buildMarkerDOMId(type, id);
        const target = document.querySelector(`[id=${markerDOMId}]`);
        const Marker = MARKERS[type];

        if (!target || !Marker) return null;

        const props = {
          type,
          id,
          isSelected: map.selected === buildTypeId(type, id),
          onClick: e => this.onMarkerClick(type, id, e),
        };

        return createPortal(<Marker {...props} />, target);
      })
    );
  }

  renderGeoButton() {
    const { map, page } = this.props.store;
    const { isGeolocating } = map;
    const { isPanelVisible } = page;
    const classes = cn(
      S.geoButton,
      isGeolocating && S.isGeolocating,
      isPanelVisible && S.isHidden
    );

    return (
      <Button
        className={classes}
        square
        size="l"
        onClick={this.onGeolocationClick}
      >
        <Icon type="geolocation" size="xl" />
      </Button>
    );
  }

  render() {
    const { className } = this.props;
    const classes = cn(S.root, className);

    return (
      <div className={classes} id={CONTAINER_ID}>
        {this.renderGeoButton()}
      </div>
    );
  }
}

export default MapBox;
