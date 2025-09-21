import { Button, Form, RouterStore } from '@homecode/ui';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { useProject, useProjects } from 'store/projects';

import S from './EditProject.styl';

const validationSchema = {
  name: { type: 'string', empty: false },
  domain: { type: 'string', empty: false },
};

export default function EditProject({
  id,
  onComplete,
}: {
  id?: string;
  onComplete: () => void;
}) {
  const projects = useProjects();
  const data = useProject(id || '');

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async ({ name, domain }) => {
    setIsLoading(true);
    try {
      const res = await projects.upsert({ id, name, domain });
      if (res?.project?.id) {
        RouterStore.go(`/project/${res.project.id}`);
      }
    } finally {
      setIsLoading(false);
      onComplete();
    }
  }, []);

  const onKeydown = useCallback(e => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onComplete();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  return (
    <div className={cn(S.root)}>
      <Form
        initialValues={{ name: data?.name, domain: data?.domain }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ Field }) => (
          <>
            <Field name="name" label="Name" className={S.field} />
            <Field
              name="domain"
              label="Domain"
              placeholder="https://example.com"
              className={S.field}
            />

            <Button
              variant="clear"
              className={S.addButton}
              loading={isLoading}
              type="submit"
            >
              {id ? 'Save' : 'Add'}
            </Button>
          </>
        )}
      </Form>
    </div>
  );
}
