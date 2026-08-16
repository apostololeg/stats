import { Button, Icon } from '@homecode/ui';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import EditProject from 'components/EditProject/EditProject';
import ButtonLink from 'components/UI/ButtonLink/ButtonLink';
import { useProjects } from 'store/projects';
import { useRouterPath } from 'store/router';
import { reportEvent } from 'tools/analytics';

import S from './ProjectsList.styl';

type Props = {
  itemProps?: any;
  renderItem?: (item: any) => React.ReactNode;
  inline?: boolean;
};

function ProjectItem({
  id,
  name,
  renderItem,
  activeClassName,
  ...props
}: {
  id: string;
  name: string;
  renderItem: (item: any) => React.ReactNode;
  activeClassName?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const projects = useProjects();
  const path = useRouterPath();
  const [isEditing, setIsEditing] = useState(false);
  const isActive = path === `/project/${id}`;

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
        className={cn(props.className, isActive && activeClassName)}
        onClick={e => {
          props?.onClick?.(e);
          reportEvent('project_click');
        }}
        href={`/project/${id}`}
        {...(isActive && { 'aria-current': 'page' as const })}
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

export default function ProjectsList({ itemProps, renderItem, inline }: Props) {
  const projects = useProjects(['items']);
  const [isShowAddForm, setIsShowAddForm] = useState(false);

  useEffect(() => {
    projects.load();
  }, []);

  return (
    <div className={cn(S.root, inline && S.inline)}>
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
            onClick={() => setIsShowAddForm(true)}
            prefixElem={<Icon type="plus" size="s" />}
          >
            Add Project
          </Button>
        </div>
      )}
    </div>
  );
}
