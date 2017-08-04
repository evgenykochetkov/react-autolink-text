/* global describe it expect */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AutoLinkText from '../src';

describe('<AutoLinkText />', () => {
  function renderText(text, props = {}) {
    return ReactDOMServer.renderToStaticMarkup(
      <AutoLinkText
        text={text}
        {...props}
      />
    );
  }

  it('renders an empty span if no text is provided', () => {
    expect(
      renderText()
    ).toEqual('<span></span>');
  });

  describe('URL linking', () => {
    it('should automatically link URLs in the form of http://opengov.com', () => {
      expect(
        renderText('Joe went to http://opengov.com')
      ).toEqual('<span><span>Joe went to </span><a href="http://opengov.com">opengov.com</a></span>');
    });

    it('should automatically link URLs in the form of https://opengov.com', () => {
      expect(
        renderText('Joe went to https://opengov.com')
      ).toEqual('<span><span>Joe went to </span><a href="https://opengov.com">opengov.com</a></span>');
    });

    it('should automatically link localhost URLs when there is a protocol', () => {
      expect(
        renderText('Joe visited http://localhost today')
      ).toEqual('<span><span>Joe visited </span><a href="http://localhost">localhost</a><span> today</span></span>');
    });

    it('should automatically link localhost URLs when there is a protocol and port', () => {
      expect(
        renderText('Joe visited http://localhost:8000 today')
      ).toEqual('<span><span>Joe visited </span><a href="http://localhost:8000">localhost:8000</a><span> today</span></span>');
    });

    it('should automatically link URLs in the form of http://www.opengov.com (i.e. protocol and www prefix)', () => {
      expect(
        renderText('Joe checked out http://www.opengov.com last week')
      ).toBe('<span><span>Joe checked out </span><a href="http://www.opengov.com">opengov.com</a><span> last week</span></span>');
    });

    it('should NOT autolink possible URLs with the "javascript:" URI scheme', () => {
      expect(
        renderText('do not link javascript:window.alert("hi") please')
      ).toBe('<span><span>do not link javascript:window.alert(&quot;hi&quot;) please</span></span>');
    });

    it('should NOT automatically link strings of the form "git:d" (using the heuristic that the domain name does not have a "." in it)', () => {
      expect(
        renderText('Something like git:d should not be linked as a URL')
      ).toBe('<span><span>Something like git:d should not be linked as a URL</span></span>');
    });

    it('should NOT automatically link strings of the form ":git:domain" (using the heuristic that the domain name does not have a "." in it)', () => {
      expect(
        renderText('Something like git:domain should not be linked as a URL')
      ).toBe('<span><span>Something like git:domain should not be linked as a URL</span></span>');
    });

    it('should automatically link strings of the form "git:domain.com", interpreting this as a protocol and domain name', () => {
      expect(
        renderText('Something like git:domain.com should be linked as a URL')
      ).toBe('<span><span>Something like </span><a href="git:domain.com">git:domain.com</a><span> should be linked as a URL</span></span>');
    });

    it('should NOT automatically link a string in the form of "git:1.0"', () => {
      expect(
        renderText('git:1.0')
      ).toBe('<span><span>git:1.0</span></span>');
    });

    it('should NOT automatically link supposed protocol-relative URLs in the form of abc//yahoo.com, which is most likely not supposed to be interpreted as a URL', () => {
      expect(
        renderText('Joe went to abc//opengov.com')
      ).toBe('<span><span>Joe went to abc//opengov.com</span></span>');
    });

    it('should automatically link protocol-relative URLs', () => {
      expect(
        renderText('Joe visited //opengov.com this morning')
      ).toBe('<span><span>Joe visited </span><a href="//opengov.com">opengov.com</a><span> this morning</span></span>');
    });

    it('should automatically add protocol to URLs', () => {
      expect(
        renderText('Joe visited opengov.com this morning')
      ).toBe('<span><span>Joe visited </span><a href="http://opengov.com">opengov.com</a><span> this morning</span></span>');
    });

    it('should strip trailing slash from anchor text', () => {
      expect(
        renderText('Joe visited https://www.opengov.com/ this morning')
      ).toBe('<span><span>Joe visited </span><a href="https://www.opengov.com/">opengov.com</a><span> this morning</span></span>');
    });

    it('links URL without leading or trailing text', () => {
      expect(
        renderText('https://www.opengov.com')
      ).toBe('<span><a href="https://www.opengov.com">opengov.com</a></span>');
    });

    it('defaults to blank text', () => {
      expect(
        renderText(null)
      ).toBe('<span></span>');
    });
  });

  describe('truncating text with links', () => {
    it('should truncate a text span', () => {
      expect(
        renderText('Joe bookmarked http://opengov.com yesterday in his browser', { maxLength: 36 })
      ).toBe('<span><span>Joe bookmarked </span><a href="http://opengov.com">opengov.com</a><span> yesterday</span></span>');
    });

    it('should allow "maxLength" prop to be a string', () => {
      expect(
        renderText('This message will be cut off', { maxLength: '13' })
      ).toBe('<span><span>This message </span></span>');
    });
  });

  it('should allow to pass additional props for links', () => {
    expect(
      renderText('http://opengov.com', { linkProps: { className: 'customClass', target: '_blank' } })
    ).toBe('<span><a href="http://opengov.com" class="customClass" target="_blank">opengov.com</a></span>');
  });
});
