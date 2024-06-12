import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '~/components/ui/table';
import { LEVELS } from '../Leaderboard/data/levels';

const getColorForLevel = (level) => {
  // Gradient from light green to dark red
  const startColor = [173, 255, 47]; // Light green (rgb)
  const endColor = [255, 0, 0]; // Dark red (rgb)
  
  const interpolate = (start, end, factor) => start + (end - start) * factor;
  
  const factor = (level - 1) / (Object.keys(LEVELS).length - 1);
  
  const r = Math.round(interpolate(startColor[0], endColor[0], factor));
  const g = Math.round(interpolate(startColor[1], endColor[1], factor));
  const b = Math.round(interpolate(startColor[2], endColor[2], factor));
  
  return `rgb(${r}, ${g}, ${b})`;
};

const XPBoard = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px] text-lg text-blue-400">Level</TableHead>
          <TableHead></TableHead>
          <TableHead className="w-[150px] text-left text-blue-400">XP need</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.values(LEVELS).map((level, index) => (
          <TableRow key={index}>
            <TableCell
              className="inline-block text-base px-2 py-1 rounded-full mt-3.5"
              style={{ backgroundColor: getColorForLevel(index + 1), color: '#fff' }}
            >
              {level.label}
            </TableCell>
            <TableCell className="text-base">{level.icon}</TableCell>
            <TableCell className="text-left text-base text-blue-600">{level.exp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default XPBoard;
