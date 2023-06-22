import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { Button, Form, Icon } from '@homecode/ui';

import ProjectsStore from 'store/projects';

import S from './AddProject.styl';

const validationSchema = {
  name: { type: 'string', empty: false },
  domain: { type: 'string', empty: false },
};

export default function AddProject() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onAddClick = useCallback(() => {
    if (!isOpen) return setIsOpen(true);
  }, []);

  const onSubmit = useCallback(async ({ name, domain }) => {
    setIsLoading(true);
    try {
      await ProjectsStore.add({ name, domain });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }, []);

  const onKeydown = useCallback(e => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  const addButton = (
    <Button
      variant="clear"
      onClick={onAddClick}
      size="l"
      className={S.addButton}
      loading={isLoading}
      type="submit"
    >
      {isOpen ? 'Add' : <Icon type="plus" />}
    </Button>
  );

  return (
    <div className={cn(S.root, isOpen && S.open)}>
      {isOpen ? (
        <Form
          initialValues={{ name: '', domain: '' }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ Field }) => (
            <>
              <Field name="name" label="Name" className={S.field} size="l" />
              <Field
                name="domain"
                label="Domain"
                placeholder="https://example.com"
                className={S.field}
                size="l"
              />

              {addButton}
            </>
          )}
        </Form>
      ) : (
        addButton
      )}
    </div>
  );
}
