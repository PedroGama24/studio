import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validarTema} from '../tools/tema.mjs';

test('tema válido passa', () => {
  const r = validarTema({destaque: '#FFE14D', texto: '#FFFFFF', fundo: '#111111', fonte: 'Arial Black'});
  assert.equal(r.ok, true);
  assert.deepEqual(r.erros, []);
});

test('tema inválido aponta cada campo errado', () => {
  const r = validarTema({destaque: 'amarelo', texto: '#FFF', fundo: '#111111'});
  assert.equal(r.ok, false);
  for (const campo of ['destaque', 'texto', 'fonte']) {
    assert.ok(r.erros.some((e) => e.includes(campo)), `erros devem citar ${campo}`);
  }
  assert.ok(!r.erros.some((e) => e.includes('fundo')));
});

test('o que não é objeto é recusado', () => {
  assert.equal(validarTema(null).ok, false);
  assert.equal(validarTema('x').ok, false);
});
