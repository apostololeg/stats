import { Button, Icon, Popup } from '@homecode/ui';
import cn from 'classnames';
import { useState } from 'react';

import S from './EmbedButton.styl';

export default function EmbedButton({ pid }: { pid: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const code = `<script src="https://stats.apostol.space/api/client?pid=${pid}"></script>`;

  const copyToClipboard = () => {
    if (isCopied) return;

    try {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popup
      className={S.root}
      blur
      direction="bottom-right"
      focusControl
      trigger={
        <Button variant="clear" size="s" round>
          Embed
        </Button>
      }
      // triggerProps={{ className: S.trigger }}
      contentProps={{ className: cn(S.content, isCopied && S.isCopied) }}
      content={
        <pre>
          {code}
          <Button size="s" square={!isCopied} onClick={copyToClipboard}>
            {isCopied ? (
              <>
                Copied&nbsp;
                <Icon type="check" size="s" />
              </>
            ) : (
              <Icon type="copy" size="s" />
            )}
          </Button>
        </pre>
      }
      onClose={() => setIsCopied(false)}
    />
  );
}
