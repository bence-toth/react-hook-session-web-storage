# react-hook-session-web-storage :anchor:

A React hook to access `sessionStorage`.

## Installation

Using `npm`:

```sh
npm install react-hook-session-web-storage
```

Using `yarn`:

```sh
yarn add react-hook-session-web-storage
```

## Basic usage

The `useSessionStorage` hook, similarly to the `useState` hook, returns an array of two elements:

- The first element contains the value stored in `sessionStorage`.

- The second element is a function which can be called with a value which will be converted to string and stored in `sessionStorage`. If this function is called without an argument, or with the argument `null` or `undefined`, the `sessionStorage` entry will be removed.

The key to the `sessionStorage` entry you want to access must be supplied to the hook as its first argument.

For example:

```jsx
import useSessionStorage from "react-hook-session-web-storage";

const ComponentWithSessionStorage = () => {
  const [value, setValue] = useSessionStorage("myKey");

  return (
    <div>
      <p>Value in SessionStorage: {value}</p>
      <button
        onClick={() => {
          setValue("Value from hook");
        }}
      >
        Set myKey
      </button>
      <button
        onClick={() => {
          setValue(null);
        }}
      >
        Unset myKey
      </button>
    </div>
  );
};
```

## Using multiple `sessionStorage` entires

The `useSessionStorage` hook can work with multiple `sessionStorage` entries simultaneously.

In order to achieve this, the first argument specified when calling the hook must be an object instead of a string. The keys of the object will represent the `sessionStorage` entry keys used by the hook. The values specified in this object will be ignored, in order to avoid confusion, it is recommended to use `null` as values.

If the `useSessionStorage` hook is called like this, the array it returns will contain two elements:

- The first element is an object which contains all values in the `sessionStorage` by the keys specified in the object the hook was called with.

- The second element is a function which expects an object as a parameter, in which the keys must be a subset of the keys of the object the hook was called with. Every `sessionStorage` entry corresponding to a key in this object will be set to the value specified by that key (converted to string). If the value by any key is `null` or `undefined`, the corresponding `sessionStorage` entry will be unset.

For example:

```jsx
import useSessionStorage from "react-hook-session-web-storage";

const ComponentWithSessionStorage = () => {
  const [values, setValues] = useSessionStorage({
    myKey: null,
    myOtherKey: null,
  });

  const { myKey, myOtherKey } = values;

  return (
    <div>
      <p>
        Values in SessionStorage: {myKey}, {myOtherKey}
      </p>
      <button
        onClick={() => {
          setValues({ myKey: "Setting myKey from hook" });
        }}
      >
        Set myKey, leave myOtherKey intact
      </button>
      <button
        onClick={() => {
          setValues({ myOtherKey: "Setting myOtherKey from hook" });
        }}
      >
        Set myOtherKey, leave myKey intact
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: "Setting myKey from hook",
            myOtherKey: "Setting myOtherKey from hook",
          });
        }}
      >
        Set both myKey and myOtherKey
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: null,
          });
        }}
      >
        Unset myKey, leave myOtherKey intact
      </button>
      <button
        onClick={() => {
          setValues({
            myOtherKey: null,
          });
        }}
      >
        Unset myOtherKey, leave myKey intact
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: "Setting myKey from hook",
            myOtherKey: null,
          });
        }}
      >
        Set myKey and unset myOtherKey
      </button>
      <button
        onClick={() => {
          setValues({
            myKey: null,
            myOtherKey: null,
          });
        }}
      >
        Unset both myKey and myOtherKey
      </button>
    </div>
  );
};
```

## Enable syncing

By default `sessionStorage` will be accessed only once when the component using the hook is mounted.

The hook can be configured to automatically react to changes of the `sessionStorage` entry or entries by calling it with a second `options` parameter, in which by the key `syncFrequency` the frequency of reading the data from `sessionStorage` can be specified in milliseconds.

This feature works the same way whether the hook is used with a single `sessionStorage` entry or multiple entires.

For example:

```jsx
import useSessionStorage from "react-hook-session-web-storage";

const ComponentWithSessionStorage = () => {
  const [value, setValue] = useSessionStorage("myKey", { syncFrequency: 1000 });

  return (
    <div>
      <p>Value in SessionStorage: {value}</p>
      <button
        onClick={() => {
          setValue("Value from hook");
        }}
      >
        Set value with hook
      </button>
      <button
        onClick={() => {
          setValue(null);
        }}
      >
        Unset value
      </button>
    </div>
  );
};
```

Be aware that when the hook is used like this, the component will access `sessionStorage` at regular intervals, which can result in a delay in registering changes and lead to performance issues if the update frequency is low.

## Limitations

`sessionStorage` is using the Storage interface of the Web Storage API which requires all keys and values to be strings.

## Migrating from 1.x.x

If you were using default import, remember to specify the `syncFrequency` in the second `options` parameter when calling the hook to keep syncing with `sessionStorage`.

If you were using the named import `useSessionStorageNoSync`, simply switch to default import.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## License

`react-hook-session-web-storage` is licensed under [LGPL](./LICENSE).
