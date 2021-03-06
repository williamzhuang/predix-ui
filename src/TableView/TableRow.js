import React from 'react';
import style from './px-table-row-style.scss';
import classnames from 'classnames';


/**
 * px-table-row component
 * https://github.com/PredixDev/px-table-view/blob/master/px-table-row.html
 */
export default ({
  title = 'Row Title',
  subtitle,
  body,
  image,

  labelLeft,
  labelRight,

  iconLeft,
  iconRight,

  editMode,

  tappable,
  underlayContent,
  rowContent,
  children
}) => {

  const baseClassnames = classnames(
    'table-row',
    {'table-row--tappable': tappable}
  );


  const mediaClassnames = classnames(
    'table-row__media',
    { 'table-row__media--icon': iconLeft || iconRight },
    { 'table-row__media--left': iconLeft },
    { 'table-row__media--right': iconRight }
  );

  return (
    <div className='px-table-row'>
      <div className={baseClassnames}>
        {labelLeft && <span className="table-row__label table-row__label--left">{labelLeft}</span>}
        {image && <div className="table-row__media table-row__media--image"><img src={image} alt={title}/></div>}
        {(iconLeft || iconLeft) && <div className={mediaClassnames}>{iconLeft}</div>}


        {editMode && <div className="table-row__media table-row__media--icon table-row__media--right"><button className="btn btn--bare table-row__handle">hamburger</button></div>}
        {labelRight && <span className="table-row__label table-row__label--right">{labelRight}</span>}

        <div className="table-row__content">
          {title && <span className="table-row__title">{title}</span>}
          {subtitle && <span className="table-row__subtitle">{subtitle}</span>}
          {body && <span className="table-row__body">{body}</span>}
          {rowContent}
        </div>
      </div>
      <div className="table-row__content">
        {children}
      </div>
      <div id="underlay" className="flex flex--stretch">
        {underlayContent}
      </div>
      <style jsx global>{style}</style>
    </div>
  );
}
