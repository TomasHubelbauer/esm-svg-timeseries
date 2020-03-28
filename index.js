export default function render(/** @type {SVGElement} */ svg, /** @type {{ stamp: Date; value: Number; }[]} */ data, /** @type {Boolean} */ zero = true) {
  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));

  const fragment = document.createDocumentFragment();

  // Find the minimum & maximum stamp and value for positioning calculations
  let minStamp;
  let maxStamp;
  let minValue;
  let maxValue;
  for (const { stamp, value } of data) {
    if (!(stamp instanceof Date)) {
      throw new Error(`Stamp '${stamp}' is not a Date instance.`);
    }

    if (!Number.isFinite(value) || Number.isNaN(value)) {
      throw new Error(`Value '${value}' is not finite or is not a number.`);
    }

    if (minStamp === undefined || minStamp > stamp) {
      minStamp = stamp;
    }

    if (maxStamp === undefined || maxStamp < stamp) {
      maxStamp = stamp;
    }

    if (minValue === undefined || minValue > value) {
      minValue = value;
    }

    if (maxValue === undefined || maxValue < value) {
      maxValue = value;
    }
  }

  if (minStamp === undefined || maxStamp === undefined || minValue === undefined || maxValue === undefined) {
    throw new Error('Stamp or value is not valid.');
  }

  // Opt out of jumpy plot by always basing the value at zero
  if (zero) {
    minValue = 0;
  }

  // Use a dummy SVG text element to perform text measurements
  const dummyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  dummyText.textContent = 'X';
  svg.append(dummyText);
  const dummyTextRect = dummyText.getBoundingClientRect();
  const textSize = dummyTextRect.bottom - dummyTextRect.top;

  // Place the min stamp text and shift the X axis up to accomodate
  dummyText.textContent = minStamp.toLocaleTimeString();
  const minStampTextLength = dummyText.getComputedTextLength();
  const minStampText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  minStampText.textContent = minStamp.toLocaleTimeString();
  minStampText.setAttribute('x', textSize);
  minStampText.setAttribute('y', height - minStampTextLength);
  minStampText.style.writingMode = 'sideways-lr';
  fragment.append(minStampText);

  // Place the max stamp text and shift the X axis up to accomodate
  dummyText.textContent = maxStamp.toLocaleTimeString();
  const maxStampTextLength = dummyText.getComputedTextLength();
  const maxStampText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  maxStampText.textContent = maxStamp.toLocaleTimeString();
  maxStampText.setAttribute('x', width);
  maxStampText.setAttribute('y', height - minStampTextLength);
  maxStampText.style.writingMode = 'sideways-lr';
  fragment.append(maxStampText);

  // Keep track of the shift needed to accomodate the X axis texts
  const xAxisOffset = Math.max(minStampTextLength, maxStampTextLength);

  // Draw the X axis line
  const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxisLine.setAttribute('x1', 0);
  xAxisLine.setAttribute('y1', height - xAxisOffset);
  xAxisLine.setAttribute('x2', width);
  xAxisLine.setAttribute('y2', height - xAxisOffset);
  xAxisLine.setAttribute('stroke', 'black');
  fragment.append(xAxisLine);

  // Place the min value text and shift the Y axis right to accomodate
  dummyText.textContent = maxValue;
  const maxValueTextLength = dummyText.getComputedTextLength();
  const maxValueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  maxValueText.textContent = maxValue;
  maxValueText.setAttribute('x', 0);
  maxValueText.setAttribute('y', textSize);
  fragment.append(maxValueText);

  // Place the min value text and shift the Y axis right to accomodate
  dummyText.textContent = minValue;
  const minValueTextLength = dummyText.getComputedTextLength();
  const minValueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  minValueText.textContent = minValue;
  minValueText.setAttribute('x', 0);
  minValueText.setAttribute('y', height - xAxisOffset);
  fragment.append(minValueText);

  // Keep track of the shift needed to accomodate the Y axis texts
  const yAxisOffset = Math.max(maxValueTextLength, minValueTextLength);

  // Draw the Y axis
  const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxisLine.setAttribute('x1', yAxisOffset);
  yAxisLine.setAttribute('y1', 0);
  yAxisLine.setAttribute('x2', yAxisOffset);
  yAxisLine.setAttribute('y2', height - xAxisOffset);
  yAxisLine.setAttribute('stroke', 'black');
  fragment.append(yAxisLine);

  // Update the X axis area to accomodate the Y axis texts
  xAxisLine.setAttribute('x1', yAxisOffset);
  minStampText.setAttribute('x', textSize + yAxisOffset);

  // Calculate the stamp and value ranges to compare the values to
  const stampRange = maxStamp - minStamp;
  const valueRange = maxValue - minValue;

  const trendPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  trendPolyline.setAttribute('fill', 'none');
  trendPolyline.setAttribute('stroke', 'black');
  trendPolyline.setAttribute('points', '');
  fragment.append(trendPolyline);

  const plotWidth = width - yAxisOffset;
  const plotHeight = height - xAxisOffset;
  for (const { stamp, value } of data) {
    const x = yAxisOffset + ((stamp - minStamp) / stampRange) * plotWidth;
    const y = (1 - ((value - minValue) / valueRange)) * plotHeight;

    const pointEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    pointEllipse.setAttribute('cx', x);
    pointEllipse.setAttribute('cy', y);
    pointEllipse.setAttribute('rx', 1.5);
    pointEllipse.setAttribute('ry', 1.5);
    pointEllipse.setAttribute('fill', 'none');
    pointEllipse.setAttribute('stroke', 'black');
    fragment.append(pointEllipse);

    trendPolyline.setAttribute('points', trendPolyline.getAttribute('points') + ` ${x},${y}`);
  }

  svg.innerHTML = '';
  svg.append(fragment);
}
