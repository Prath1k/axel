import React, { useRef } from 'react';
import { useStickerStore } from '../../store/stickerStore';
import type { Sticker } from '../../store/stickerStore';
import { motion } from 'framer-motion';

export default function StickerLayer() {
  const { stickers, updateSticker } = useStickerStore();
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div id="sticker-container" ref={constraintsRef}>
      {stickers.map((sticker) => (
        <StickerItem 
          key={sticker.id} 
          sticker={sticker} 
          constraintsRef={constraintsRef}
          onDrag={(x, y) => updateSticker(sticker.id, { x, y })}
        />
      ))}
    </div>
  );
}

function StickerItem({ 
  sticker, 
  constraintsRef, 
  onDrag 
}: { 
  sticker: Sticker; 
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  onDrag: (x: number, y: number) => void;
}) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      onDragEnd={(_, info) => onDrag(info.point.x, info.point.y)}
      initial={{ x: sticker.x, y: sticker.y, scale: 0 }}
      animate={{ x: sticker.x, y: sticker.y, scale: sticker.scale, rotate: sticker.rotation }}
      className="sticker text-4xl select-none"
      style={{ left: 0, top: 0 }}
    >
      {sticker.type}
    </motion.div>
  );
}
