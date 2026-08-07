# Крок 3: Інтерактивний Canvas-компонент рулетки

На цьому етапі ми створимо компонент рулетки (`src/shared/ui/RouletteWheel.tsx`) на базі HTML5 Canvas. Замість важких DOM-трансформацій ми використаємо холст, що забезпечить плавну анімацію обертання з частотою 60 кадрів/сек.

Додамо фізику: початковий імпульс, тертя (згасання швидкості) та розрахунок переможного сегмента.

---

## 1. Створення компонента рулетки (`src/shared/ui/RouletteWheel.tsx`)

Створіть файл `RouletteWheel.tsx` у директорії `src/shared/ui/`:

```tsx
import React, { useEffect, useRef, useState } from 'react';

interface RouletteWheelProps {
  items: string[]; // назви фільмів (сегментів)
  isSpinning: boolean;
  onSpinComplete: (selectedIndex: number) => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  items,
  isSpinning,
  onSpinComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Фізичні змінні для обертання
  const angleRef = useRef(0); // поточний кут у радіанах
  const speedRef = useRef(0); // поточна кутова швидкість
  const isSpinningRef = useRef(false);

  // Палітра неонових кольорів для сегментів рулетки
  const colors = [
    '#a855f7', // primary neon purple
    '#ec4899', // secondary neon pink
    '#06b6d4', // accent neon cyan
    '#10b981', // emerald neon green
    '#f59e0b', // amber yellow
    '#3b82f6', // blue
  ];

  // Малювання рулетки
  const drawWheel = (ctx: CanvasRenderingContext2D, size: number) => {
    const center = size / 2;
    const radius = center - 10;
    const numSegments = items.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);

    if (numSegments === 0) {
      // Якщо немає даних, малюємо пусту заставку
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e1b4b'; // темно-синій
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#a855f7';
      ctx.stroke();
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Налаштуйте фільтри та запустіть!', center, center);
      return;
    }

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angleRef.current);

    // 1. Малюємо кольорові сегменти
    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Обираємо кольори по колу
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      // Тонкі внутрішні грані
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();
    }

    // 2. Рендеримо текст на сегментах
    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * segmentAngle;
      ctx.save();
      
      // Повертаємо контекст на середину поточного сегменту
      ctx.rotate(startAngle + segmentAngle / 2);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Outfit, Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Обрізаємо занадто довгі назви фільмів для красивого відображення
      let text = items[i];
      if (text.length > 20) {
        text = text.substring(0, 18) + '...';
      }

      // Зміщуємо текст ближче до краю рулетки
      ctx.fillText(text, radius - 20, 0);
      ctx.restore();
    }

    ctx.restore();

    // 3. Зовнішній обруч з неоновим свіченням
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1e152a';
    ctx.stroke();

    // Світлодіодні крапки (LEDs) по краю рулетки
    for (let i = 0; i < 24; i++) {
      const ledAngle = (i * 2 * Math.PI) / 24;
      const ledX = center + (radius + 2) * Math.cos(ledAngle);
      const ledY = center + (radius + 2) * Math.sin(ledAngle);
      ctx.beginPath();
      ctx.arc(ledX, ledY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#a855f7' : '#ec4899';
      ctx.fill();
    }

    // 4. Малюємо центральну кнопку/вісь
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#06b6d4';
    ctx.stroke();

    // 5. Вказівник (стрілочка зверху)
    ctx.beginPath();
    ctx.moveTo(center - 15, center - radius - 15);
    ctx.lineTo(center + 15, center - radius - 15);
    ctx.lineTo(center, center - radius + 15);
    ctx.closePath();
    ctx.fillStyle = '#06b6d4'; // Неоновий cyan
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0; // скидаємо тінь
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  };

  // Логіка фізики обертання
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const size = canvas.width;

    const animate = () => {
      if (isSpinningRef.current) {
        // Обертаємо
        angleRef.current += speedRef.current;
        // Гальмуємо (тертя)
        speedRef.current *= 0.982; // коефіцієнт гальмування

        // Якщо швидкість впала нижче критичного мінімуму — зупиняємо
        if (speedRef.current < 0.002) {
          isSpinningRef.current = false;
          speedRef.current = 0;

          // Розрахунок вибраного фільму
          // Вказівник знаходиться зверху (кут -PI/2 або 3*PI/2)
          const numSegments = items.length;
          const segmentAngle = (2 * Math.PI) / numSegments;
          
          // Нормалізуємо кут до [0, 2*PI]
          let normalizedAngle = (3 * Math.PI / 2 - angleRef.current) % (2 * Math.PI);
          if (normalizedAngle < 0) {
            normalizedAngle += 2 * Math.PI;
          }

          const winningIndex = Math.floor(normalizedAngle / segmentAngle) % numSegments;
          onSpinComplete(winningIndex);
        }
      }

      drawWheel(ctx, size);
      animationFrameId = requestAnimationFrame(animate);
    };

    drawWheel(ctx, size);
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Запуск обертання при зміні пропсу isSpinning
  useEffect(() => {
    if (isSpinning && !isSpinningRef.current && items.length > 0) {
      isSpinningRef.current = true;
      // Встановлюємо високу стартову швидкість з випадковим імпульсом
      speedRef.current = 0.4 + Math.random() * 0.2;
    }
  }, [isSpinning, items]);

  return (
    <div className="relative flex justify-center items-center p-4 bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl shadow-2xl">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full max-w-[360px] aspect-square rounded-full transition-all duration-300"
      />
    </div>
  );
};
```

---

## 3. Публічна точка входу для Shared UI (`src/shared/ui/index.ts`)
Створіть файл `index.ts` в папці `src/shared/ui/` для реекспорту компонентів спільного використання (зокрема, рулетки):

```typescript
export { RouletteWheel } from "./RouletteWheel";
```

---

## 4. Пояснення фізики розрахунку
*   `angleRef.current` — зберігає накопичений кут у радіанах.
*   Кожен кадр кут збільшується на `speedRef.current`.
*   Швидкість зменшується за геометричною прогресією (`speed *= 0.982`), що імітує реальне фізичне тертя підшипника.
*   Зупинка фіксується при `speed < 0.002`. Кут вказує на поточну позицію. Оскільки стрілочка розташована зверху (кут `270°` або `3*PI/2`), ми проектуємо обертання на цю позицію для точного визначення переможного індексу.

Ми створили серце додатку — рулетку та її точку входу. Наступний крок — розробка панелі фільтрації та модального вікна деталей фільму.
