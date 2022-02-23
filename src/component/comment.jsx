import React, { Component } from 'react'
import Avatar from './avatar'
import Svg from './svg'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { es, ru, fr, zhCN, zhTW, ko, pl, de } from 'date-fns/locale'
import 'github-markdown-css/github-markdown.css'

if (typeof window !== `undefined`) {
  window.GT_i18n_LocaleMap = {
    zh: zhCN,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'es-ES': es,
    fr: fr,
    ru: ru,
    pl: pl,
    ko: ko,
    de: de
  }
}

export default class Comment extends Component {
  shouldComponentUpdate ({ comment }) {
    return comment !== this.props.comment
  }

  componentDidMount () {
    const comment = this.node
    const emailResponse = comment.querySelector('.email-hidden-toggle>a')
    if (emailResponse) {
      emailResponse.addEventListener('click', e => {
        e.preventDefault()
        comment.querySelector('.email-hidden-reply').classList.toggle('expanded')
      }, true)
    }
  }

  render () {
    const {
      comment,
      user,
      language,
      commentedText = '',
      admin = [],
      replyCallback
    } = this.props
    const enableEdit = user && comment.user.login === user.login
    const isAdmin = ~[]
      .concat(admin)
      .map(a => a.toLowerCase())
      .indexOf(comment.user.login.toLowerCase())

    return (
      <div ref={node => { this.node = node }} className={`gt-comment ${isAdmin ? 'gt-comment-admin' : ''}`}>
        <Avatar
          className="gt-comment-avatar"
          src={comment.user && comment.user.avatar_url}
          alt={comment.user && comment.user.login}
        />

        <div className="gt-comment-content">
          <div className="gt-comment-header">
            <div className={`gt-comment-block-${user ? '2' : '1'}`} />
            <a
              className="gt-comment-username"
              href={comment.user && comment.user.html_url}
            >
              {comment.user && comment.user.login}
            </a>
            <span className="gt-comment-text">{commentedText}</span>
            <span className="gt-comment-date">
              {formatDistanceToNow(
                parseISO(comment.created_at),
                {
                  addSuffix: true,
                  locale: window.GT_i18n_LocaleMap[language]
                }
              )}
            </span>
          </div>
          <div
            className="gt-comment-body markdown-body"
            dangerouslySetInnerHTML={{
              __html: comment.body_html
            }}
          />
        </div>
      </div>
    )
  }
}
