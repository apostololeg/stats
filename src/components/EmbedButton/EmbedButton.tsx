import { Button, Icon, Popup } from '@homecode/ui';
import cn from 'classnames';
import { useEffect, useState } from 'react';

import S from './EmbedButton.styl';

export default function EmbedButton({ pid }: { pid: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const [sdkCode, setSdkCode] = useState<string>('');

  useEffect(() => {
    fetch('/sdk/stats.min.js')
      .then(res => res.text())
      .then(code => setSdkCode(code.replace(/__STATS_PID__/g, pid)))
      .catch(() => setSdkCode(''));
  }, [pid]);

  const copyToClipboard = () => {
    if (isCopied || !sdkCode) return;

    try {
      navigator.clipboard.writeText(sdkCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
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
      contentProps={{ className: cn(S.content, isCopied && S.isCopied) }}
      content={
        <pre>
          {sdkCode}
          <Button size="s" onClick={copyToClipboard}>
            {isCopied ? (
              <>
                Copied&nbsp;&nbsp;
                <Icon type="check" size="s" />
              </>
            ) : (
              <>
                Copy&nbsp;&nbsp;
                <Icon type="copy" size="s" />
              </>
            )}
          </Button>
        </pre>
      }
      onClose={() => setIsCopied(false)}
    />
  );
}
