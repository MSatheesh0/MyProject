import React, { useRef } from 'react';
import { TimelineItem as TimelineItemType } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface TimelineItemProps {
  item: TimelineItemType;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLeft }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useScrollAnimation(itemRef);

  return (
    <div ref={itemRef} className={`Timeline_timelineItem ${isLeft ? 'Timeline_timelineItem--left' : 'Timeline_timelineItem--right'} ${isInView ? 'Timeline_timelineItem--visible' : ''}`}>
      <div className="Timeline_timelineDot"></div>
      <div className="Timeline_timelineContent">
        <span className="Timeline_date">{item.date}</span>
        <h3 className="Timeline_title">{item.title}</h3>
        <h4 className="Timeline_institution">{item.institution}</h4>
        {item.description && <p className="Timeline_description">{item.description}</p>}
        {item.details && (
          <ul className="Timeline_detailsList">
            {item.details.map((detail, index) => <li key={index}>{detail}</li>)}
          </ul>
        )}
        {item.tags && (
            <div className="Timeline_tags">
                {item.tags.map(tag => (
                    <span key={tag} className="Timeline_tag">{tag}</span>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

interface TimelineProps {
  items: TimelineItemType[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="Timeline_timelineContainer">
      {items.map((item, index) => (
        <TimelineItem key={index} item={item} isLeft={index % 2 === 0} />
      ))}
    </div>
  );
};

export default Timeline;
