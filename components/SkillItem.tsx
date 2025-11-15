import React from 'react';
import { Skill } from '../types';

interface SkillItemProps {
  skill: Skill;
}

const SkillItem: React.FC<SkillItemProps> = ({ skill }) => {
  return (
    <div className="SkillItem_skillCard">
      <div className="SkillItem_skillIcon">
        <i className={skill.icon}></i>
      </div>
      <div className="SkillItem_skillDetails">
        <h3 className="SkillItem_skillName">{skill.name}</h3>
        <div className="SkillItem_progressBarContainer">
          <div 
            className="SkillItem_progressBar" 
            style={{ width: `${skill.level}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SkillItem;
