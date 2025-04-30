import { useStore } from 'justorm/react';

import ButtonLink from 'components/UI/ButtonLink/ButtonLink';

type Props = {
  itemProps?: any;
  renderItem?: (item: any) => React.ReactNode;
};

export default function ProjectsList({ itemProps, renderItem }: Props) {
  const { projects } = useStore({
    projects: ['items'],
  });

  return projects.items.map(({ id, name }) => (
    <ButtonLink {...itemProps} href={`/project/${id}`} key={id}>
      {renderItem?.({ id, name }) || name}
    </ButtonLink>
  ));
}
