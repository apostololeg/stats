import { withStore } from 'justorm/react';

import ButtonLink from 'components/UI/ButtonLink/ButtonLink';

export default withStore({
  projects: ['items'],
})(function ProjectsList({ store: { projects }, itemProps, renderItem }) {
  return projects.items.map(({ id, name }) => (
    <ButtonLink {...itemProps} href={`/project/${id}`} key={id}>
      {renderItem?.({ id, name }) || name}
    </ButtonLink>
  ));
});
