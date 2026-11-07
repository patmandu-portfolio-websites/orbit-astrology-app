import { Fragment } from 'react';
import { modalities } from '../data/modalities.js';
import InfoTip from './InfoTip.jsx';

export default function ModalityText({ children }) {
  return children.split(/\b(cardinal|fixed|mutable)\b/gi).map((part, index) => {
    const label = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    const definition = modalities[label];
    return definition
      ? <Fragment key={index}>{part}<InfoTip label={label}>{definition.short}</InfoTip></Fragment>
      : part;
  });
}
