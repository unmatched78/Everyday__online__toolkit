// imageEditor.js
import { fabric } from 'fabric';

/**
 * Loads an image into a Fabric canvas.
 * @param {HTMLImageElement} imgEl
 * @returns {Promise<fabric.Image>}
 */
function _loadFabricImage(imgEl) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imgEl.src, (img) => {
      resolve(img);
    }, { crossOrigin: 'anonymous' });
  });
}

/**
 * Crops an image to the specified rectangle.
 * @param {HTMLImageElement} imgEl
 * @param {Object} rect - { left, top, width, height }
 * @returns {Promise<string>} - Data URL of cropped image
 */
export async function cropImage(imgEl, rect) {
  const img = await _loadFabricImage(imgEl);
  img.set({ left: -rect.left, top: -rect.top });
  const canvas = new fabric.StaticCanvas(null, {
    width: rect.width,
    height: rect.height,
  });
  canvas.add(img);
  return canvas.toDataURL();
}

/**
 * Rotates an image by degrees.
 * @param {HTMLImageElement} imgEl
 * @param {number} angle - in degrees
 * @returns {Promise<string>}
 */
export async function rotateImage(imgEl, angle) {
  const img = await _loadFabricImage(imgEl);
  img.set({ originX: 'center', originY: 'center', angle });
  const canvas = new fabric.StaticCanvas(null, {
    width: img.width,
    height: img.height,
  });
  canvas.add(img);
  return canvas.toDataURL();
}

/**
 * Adjust brightness & contrast.
 * @param {HTMLImageElement} imgEl
 * @param {Object} opts - { brightness: -1 to 1, contrast: -1 to 1 }
 * @returns {Promise<string>}
 */
export async function adjustColor(imgEl, opts) {
  const img = await _loadFabricImage(imgEl);
  if (opts.brightness != null) {
    img.filters.push(new fabric.Image.filters.Brightness({ brightness: opts.brightness }));
  }
  if (opts.contrast != null) {
    img.filters.push(new fabric.Image.filters.Contrast({ contrast: opts.contrast }));
  }
  img.applyFilters();
  const canvas = new fabric.StaticCanvas(null, {
    width: img.width,
    height: img.height,
  });
  canvas.add(img);
  return canvas.toDataURL();
}

/**
 * Apply a predefined filter (e.g., sepia, vintage).
 * @param {HTMLImageElement} imgEl
 * @param {string} filterName
 * @returns {Promise<string>}
 */
export async function applyFilter(imgEl, filterName) {
  const img = await _loadFabricImage(imgEl);
  let filter;
  switch (filterName) {
    case 'sepia':
      filter = new fabric.Image.filters.Sepia();
      break;
    case 'vintage':
      filter = new fabric.Image.filters.Vintage();
      break;
    // add more cases as needed
    default:
      throw new Error('Unknown filter: ' + filterName);
  }
  img.filters.push(filter);
  img.applyFilters();
  const canvas = new fabric.StaticCanvas(null, {
    width: img.width,
    height: img.height,
  });
  canvas.add(img);
  return canvas.toDataURL();
}
