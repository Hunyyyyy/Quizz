const MarkdownRenderer = ({ content }) => {
    const detectUrls = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
    };
  
    const LinkDisguised = ({ url, text = "Tại đây", style }) => {
      const cleanUrl = url.replace(/[.,;!?]+$/, '');
      return (
        <a
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: '500',
            ...style,
          }}
        >
          {text}
        </a>
      );
    };
  
    const urlMappings = {
      profile: { text: 'Xem hồ sơ', icon: '👤 ' },
      image: { text: 'Xem ảnh', icon: '🖼️ ' },
      default: { text: 'Tại đây', icon: '' },
    };
  
    const processContent = (content) => {
      const urls = detectUrls(content);
      if (urls.length === 1 && urls[0] === content.trim()) {
        return <LinkDisguised url={content} text="Tại đây" />;
      }
  
      const parts = content.split(/(https?:\/\/[^\s]+)/g);
      return parts.map((part, i) =>
        part.match(/^https?:\/\/[^\s]+$/) ? (
          <LinkDisguised key={i} url={part} text="Tại đây" />
        ) : (
          <span key={i}>{part}</span>
        )
      );
    };
  
    const renderers = {
      link: ({ href, children }) => {
        let type = 'default';
        if (href.includes('/profile/')) type = 'profile';
        if (href.includes('/image/') || href.match(/\.(jpg|png|gif)/i)) type = 'image';
        return (
          <span>
            {urlMappings[type].icon}
            <LinkDisguised url={href} text={urlMappings[type].text || children} />
          </span>
        );
      },
      text: ({ value }) => {
        const urlRegex = /(https?:\/\/[^\s]+[^\s.,;!?])|(https?:\/\/[^\s]+)(?=[.,;!?])/g;
        const parts = value.split(urlRegex).filter(Boolean);
        return parts.map((part, i) =>
          urlRegex.test(part) ? (
            <span key={i}>
              {urlMappings[part.includes('/profile/') ? 'profile' : part.match(/\.(jpg|png|gif)/i) ? 'image' : 'default'].icon}
              <LinkDisguised url={part} text={urlMappings[part.includes('/profile/') ? 'profile' : part.match(/\.(jpg|png|gif)/i) ? 'image' : 'default'].text} />
            </span>
          ) : (
            part
          )
        );
      },
    };
  
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...renderers,
          p: ({ children }) => <div style={{ marginBottom: '10px' }}>{children}</div>,
          ul: ({ children }) => <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>{children}</ul>,
          li: ({ children }) => <li style={{ marginBottom: '5px' }}>{children}</li>,
          h1: ({ children }) => <h1 style={{ fontSize: '1.8rem', margin: '10px 0' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: '1.6rem', margin: '10px 0' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: '1.4rem', margin: '10px 0' }}>{children}</h3>,
          strong: ({ children }) => <strong style={{ fontWeight: '600' }}>{children}</strong>,
          em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
          table: ({ children }) => (
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th style={{ border: '1px solid #ccc', padding: '8px', backgroundColor: '#f0f0f0', textAlign: 'left' }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };