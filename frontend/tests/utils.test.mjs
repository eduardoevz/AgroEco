import test from 'node:test';
import assert from 'node:assert/strict';

// Funciones de formateo y validación
function formatPercent(value) {
  if (value === undefined || value === null) return '0%';
  const num = value <= 1 ? value * 100 : value;
  return `${Math.round(num)}%`;
}

function getPlantPartLabel(part) {
  const map = {
    leaf: 'Hoja',
    stem: 'Tallo',
    fruit: 'Fruto',
  };
  return map[part] || part;
}

function getStatusLabel(status) {
  const map = {
    detected: 'Detectado',
    monitoring: 'En seguimiento',
    treated: 'Tratado',
    controlled: 'Controlado',
  };
  return map[status] || status;
}

function getSeverityLabel(severity) {
  const map = {
    low: 'Leve / Bajo',
    moderate: 'Moderado',
    high: 'Alto',
    severe: 'Severo / Crítico',
  };
  return map[severity] || severity;
}

test('formatPercent formateará decimales correctamente', () => {
  assert.equal(formatPercent(0.93), '93%');
  assert.equal(formatPercent(0.854), '85%');
  assert.equal(formatPercent(1.0), '100%');
  assert.equal(formatPercent(0), '0%');
});

test('getPlantPartLabel traduce correctamente órganos de la planta', () => {
  assert.equal(getPlantPartLabel('leaf'), 'Hoja');
  assert.equal(getPlantPartLabel('stem'), 'Tallo');
  assert.equal(getPlantPartLabel('fruit'), 'Fruto');
});

test('getStatusLabel traduce estados fitosanitarios', () => {
  assert.equal(getStatusLabel('detected'), 'Detectado');
  assert.equal(getStatusLabel('monitoring'), 'En seguimiento');
  assert.equal(getStatusLabel('treated'), 'Tratado');
  assert.equal(getStatusLabel('controlled'), 'Controlado');
});

test('getSeverityLabel traduce niveles de severidad', () => {
  assert.equal(getSeverityLabel('low'), 'Leve / Bajo');
  assert.equal(getSeverityLabel('moderate'), 'Moderado');
  assert.equal(getSeverityLabel('high'), 'Alto');
  assert.equal(getSeverityLabel('severe'), 'Severo / Crítico');
});
