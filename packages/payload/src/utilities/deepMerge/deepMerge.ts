'use strict'

// based on https://github.com/TehShrike/deepmerge
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge
// and https://github.com/fastify/deepmerge#
/*
MIT License

Copyright (c) The Fastify Team

The Fastify team members are listed at https://github.com/fastify/fastify#team
and in the README file.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import type { Options } from './types.js'

import { isReactComponentOrFunction } from '../isReactComponent.js'

export function createDeepMerge(options: Options) {
  function isNotPrototypeKey(value) {
    return value !== 'constructor' && value !== 'prototype' && value !== '__proto__'
  }

  function cloneArray(value) {
    let i = 0
    const il = value.length
    const result = new Array(il)
    for (i = 0; i < il; ++i) {
      result[i] = clone(value[i])
    }
    return result
  }

  function cloneObject(target) {
    const result = {}

    const targetKeys = getKeys(target)
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      isNotPrototypeKey((key = targetKeys[i])) && (result[key] = clone(target[key]))
    }
    return result
  }

  function concatArrays(target, source) {
    const tl = target.length
    const sl = source.length
    let i = 0
    const result = new Array(tl + sl)
    for (i = 0; i < tl; ++i) {
      result[i] = clone(target[i])
    }
    for (i = 0; i < sl; ++i) {
      result[i + tl] = clone(source[i])
    }
    return result
  }

  const propertyIsEnumerable = Object.prototype.propertyIsEnumerable
  function getSymbolsAndKeys(value) {
    const result = Object.keys(value)
    const keys = Object.getOwnPropertySymbols(value)
    for (let i = 0, il = keys.length; i < il; ++i) {
      propertyIsEnumerable.call(value, keys[i]) && result.push(keys[i])
    }
    return result
  }

  const getKeys = options && options.symbols ? getSymbolsAndKeys : Object.keys

  function isMergeableObject(value) {
    return (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof RegExp) &&
      !(value instanceof Date) &&
      !isReactComponentOrFunction(value)
    )
  }

  function isPrimitive(value) {
    return typeof value !== 'object' || value === null
  }

  const isPrimitiveOrBuiltIn =
    typeof Buffer !== 'undefined'
      ? (value) =>
          typeof value !== 'object' ||
          value === null ||
          value instanceof RegExp ||
          value instanceof Date ||
          value instanceof Buffer
      : (value) =>
          typeof value !== 'object' ||
          value === null ||
          value instanceof RegExp ||
          value instanceof Date

  const mergeArray =
    options && typeof options.mergeArray === 'function'
      ? options.mergeArray({ clone, deepmerge: _deepmerge, getKeys, isMergeableObject })
      : concatArrays

  function clone(entry) {
    return isMergeableObject(entry)
      ? Array.isArray(entry)
        ? cloneArray(entry)
        : cloneObject(entry)
      : entry
  }

  function mergeObject(target, source) {
    const result = {}
    const targetKeys = getKeys(target)
    const sourceKeys = getKeys(source)
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      isNotPrototypeKey((key = targetKeys[i])) &&
        sourceKeys.indexOf(key) === -1 &&
        (result[key] = clone(target[key]))
    }

    for (i = 0, il = sourceKeys.length; i < il; ++i) {
      isNotPrototypeKey((key = sourceKeys[i])) &&
        ((key in target &&
          (targetKeys.indexOf(key) !== -1 && (result[key] = _deepmerge(target[key], source[key])),
          true)) ||
          (result[key] = clone(source[key])))
    }
    return result
  }

  function _deepmerge(target, source) {
    const sourceIsArray = Array.isArray(source)
    const targetIsArray = Array.isArray(target)

    if (isPrimitive(source)) {
      return source
    } else if (isPrimitiveOrBuiltIn(target)) {
      return clone(source)
    } else if (sourceIsArray && targetIsArray) {
      return mergeArray(target, source)
    } else if (sourceIsArray !== targetIsArray) {
      return clone(source)
    } else {
      return mergeObject(target, source)
    }
  }
  return _deepmerge
}

export const deepMergeCombineArrays = createDeepMerge({
  mergeArray (options) {
    const deepmerge = options.deepmerge
    const clone = options.clone
    return function (target, source) {
      let i = 0
      const sl = source.length
      const il = Math.max(target.length, source.length)
      const result = new Array(il)
      for (i = 0; i < il; ++i) {
        if (i < sl) {
          result[i] = deepmerge(target[i], source[i])
        } else {
          result[i] = clone(target[i])
        }
      }
      return result
    }
  },
})

/**
 * Does not clone React components by default
 */
export const deepMerge = createDeepMerge({})

export const deepMergePreferSourceArray = createDeepMerge({
  mergeArray (_) {
    return function (_, source) {
      return source
    }
  },
})
