import { Button, Icon } from '@homecode/ui';
import { useCallback, useState } from 'react';

import EditProject from 'components/EditProject/EditProject';
import ButtonLink from 'components/UI/ButtonLink/ButtonLink';
import { useProjects } from 'store/projects';
import { reportEvent } from 'tools/analytics';

import S from './ProjectsList.styl';

type Props = {
  itemProps?: any;
  renderItem?: (item: any) => React.ReactNode;
};

function ProjectItem({
  id,
  name,
  renderItem,
  ...props
}: {
  id: string;
  name: string;
  renderItem: (item: any) => React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const projects = useProjects();
  const [isEditing, setIsEditing] = useState(false);

  const onEditClick = useCallback(
    e => {
      setIsEditing(true);
    },
    [id],
  );

  const onDeleteClick = useCallback(
    e => {
      projects.delete(id);
    },
    [id],
  );

  if (isEditing) {
    return <EditProject id={id} onComplete={() => setIsEditing(false)} />;
  }

  return (
    <div className={S.item}>
      <ButtonLink
        {...props}
        onClick={e => {
          props?.onClick?.(e);
          reportEvent('project_click');
        }}
        href={`/project/${id}`}
      >
        {renderItem?.({ id, name }) || name}
      </ButtonLink>

      <div className={S.actions}>
        <Button variant="clear" size="s" square round onClick={onEditClick}>
          <Icon type="edit" size="s" />
        </Button>
        <Button variant="clear" size="s" square round onClick={onDeleteClick}>
          <Icon type="delete" size="s" />
        </Button>
      </div>
    </div>
  );
}

export default function ProjectsList({ itemProps, renderItem }: Props) {
  const projects = useProjects(['items']);
  const [isShowAddForm, setIsShowAddForm] = useState(false);

  return (
    <>
      {projects.items.map(({ id, name }) => (
        <ProjectItem
          {...itemProps}
          key={id}
          id={id}
          name={name}
          renderItem={renderItem}
        />
      ))}

      {isShowAddForm ? (
        <EditProject id={''} onComplete={() => setIsShowAddForm(false)} />
      ) : (
        <div className={S.footer}>
          <Button
            variant="primary"
            className={S.addButton}
            onClick={() => setIsShowAddForm(true)}
          >
            Add Project
          </Button>
        </div>
      )}
    </>
  );
}
