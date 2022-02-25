import { useEffect, useState } from 'react';

import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

import styled from 'styled-components';
import { unified } from 'unified';
import { automaticRelativeDifference } from '../utils/time';

const Formatters: { [key: string]: Intl.DateTimeFormat | Intl.RelativeTimeFormat } = {
  t: new Intl.DateTimeFormat(typeof navigator != 'undefined' ? navigator.language : 'en', { timeStyle: 'short' }),
  T: new Intl.DateTimeFormat(typeof navigator != 'undefined' ? navigator.language : 'en', { timeStyle: 'medium' }),
  d: new Intl.DateTimeFormat(typeof navigator != 'undefined' ? navigator.language : 'en', { dateStyle: 'short' }),
  D: new Intl.DateTimeFormat(typeof navigator != 'undefined' ? navigator.language : 'en', { dateStyle: 'long' }),
  f: new Intl.DateTimeFormat(typeof navigator != 'undefined' ? navigator.language : 'en', { dateStyle: 'long', timeStyle: 'short' }),
  F: new Intl.DateTimeFormat(typeof navigator != 'undefined' ? navigator.language : 'en', { dateStyle: 'full', timeStyle: 'short' }),
  R: new Intl.RelativeTimeFormat(typeof navigator != 'undefined' ? navigator.language : 'en', { style: 'long', numeric: 'auto' }),
};

export function Bio({ bio }: { bio: string }) {
  const [data, setData] = useState<string>();

  async function parse(bio: string) {
    let text = bio.replace(/_  _/g, '&nbsp;&nbsp;').replace(/\\/g, '');
    const matches = [...text.matchAll(/<t:([0-9]*):([[A-Za-z]|\*])>/g)];
    for (const match of matches) {
      const timestamp = match[1];
      const type = match[2];
      const formatter = Formatters[type];

      if (formatter instanceof Intl.RelativeTimeFormat) {
        const format = automaticRelativeDifference(new Date(~~timestamp * 1000));
        text = text.replace(match[0], `\`${formatter.format(format.duration, format.unit)}\``);
      } else {
        text = text.replace(match[0], `\`${formatter.format(new Date(~~timestamp * 1000))}\``);
      }
    }
    const file = await unified().use(remarkParse).use(remarkBreaks).use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(text);
    setData(file.toString());
  }

  useEffect(() => {
    parse(bio);
  }, [bio]);

  return (
    <Container>
      <Heading>About</Heading>
      <Holder dangerouslySetInnerHTML={{ __html: data }} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 20px 0 20px;
`;

const Heading = styled.p`
  margin: 0;
  opacity: 0.6;
`;

const Holder = styled.div`
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  margin-top: -10px;

  code {
    background-color: #00000010;
    border-radius: 3px;
    padding: 0px 2px 0px 2px;
    font-size: smaller;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
