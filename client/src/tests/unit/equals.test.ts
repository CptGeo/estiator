import { equals } from "../../core/utils";
import { expect, test } from '@jest/globals';

describe("equals", () => {

  test("Similar objects should be truthy", () => {
    const obj1 = {
      string: "string",
      boolean: true,
      nullish: null,
      notANumber: NaN,
      number: 12345678910,
      undefined: undefined,
      nested: {
        string: "string",
        boolean: true,
        nullish: null,
        notANumber: NaN,
        number: 12345678910,
        undefined: undefined,
        nested: {
          nested: {
            nested: {
              val: "value"
            }
          }
        }
      }
    };

    const obj2 = {
      string: "string",
      boolean: true,
      nullish: null,
      notANumber: NaN,
      number: 12345678910,
      undefined: undefined,
      nested: {
        string: "string",
        boolean: true,
        nullish: null,
        notANumber: NaN,
        number: 12345678910,
        undefined: undefined,
        nested: {
          nested: {
            nested: {
              val: "value"
            }
          }
        }
      }
    }

    expect(equals(obj1, obj2)).toBeTruthy();
  });

  test("Objects with minor descrepancies should be falsy", () => {
    const obj1 = {
      string: "string",
      boolean: true,
      nullish: null,
      notANumber: NaN,
      number: 12345678910,
      undefined: undefined,
      nested: {
        string: "string",
        boolean: true,
        nullish: null,
        notANumber: NaN,
        number: 12345678910,
        undefined: undefined,
        nested: {
          nested: {
            nested: {
              val: "hello"
            }
          }
        }
      }
    };

    const obj2 = {
      string: "string",
      boolean: true,
      nullish: null,
      notANumber: NaN,
      number: 12345678910,
      undefined: undefined,
      nested: {
        string: "string",
        boolean: true,
        nullish: null,
        notANumber: NaN,
        number: 12345678910,
        undefined: undefined,
        nested: {
          nested: {
            nested: {
              val: null
            }
          }
        }
      }
    }

    expect(equals(obj1, obj2)).toBeFalsy();
  });

  test("Null values should be truthy", () => {
    expect(equals(null, null)).toBeTruthy();
  });

  test("Undefined values should be truthy", () => {
    expect(equals(undefined, undefined)).toBeTruthy();
  });

  test("Undefined compared with null should be falsy", () => {
    expect(equals(undefined, null)).toBeFalsy();
  });

  test("Undefined values should be truthy", () => {
    expect(equals({}, {})).toBeTruthy();
  });

})