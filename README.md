# react-hook-session-web-storage :anchor:

A React hook to access `sessionStorage`.

## Installation

Using `npm`:

```sh
npm install --save react-hook-session-web-storage
```

Using `yarn`:

```sh
yarn add react-hook-session-web-storage
```

## Basic usage

The `useSessionStorage()` hook, similarly to the `useState()` hook, returns an array of two elements:

- the first element contains the value stored in `sessionStorage`, which is getting updated at regular intervals.

- the second element is a function which can be called with a value that will be stored in `sessionStorage`. If you call this function without an argument, the `sessionStorage` entry will be removed.

The key to the `sessionStorage` entry you want to access must be supplied to the hook as its first argument:

```jsx
import React from 'react'
import useSessionStorage from 'react-hook-session-web-storage'

const ComponentWithSessionStorage = () => {
  const [value, setValue] = useSessionStorage('myKey')

  return (
    <div className="App">
      <p>Value in SessionStorage: {value}</p>
      <button
        onClick={() => setValue('Value from hook')}
      >
        Set value with hook
      </button>
      <button
        onClick={() => setValue()}
      >
        Unset value
      </button>
    </div>
  )
}
```

### Tweaking the update frequency

The default update frequency of the `sessionStorage` content is 1 second which can be overridden by calling `useSessionStorage()` with a second argument which is an options object, and has a member called `updateFrequency` that indicates the desired update frequency in milliseconds:

```jsx
const [value, setValue] = useSessionStorage(
  'myKey',
  {updateFrequency: 500}
)
```

Read more about syncing in [Caveats](#caveats).

### Caveats

This hook is accessing `sessionStorage` content at regular intervals, which can result in a delay in registering changes and lead to performance issues if the update frequency is low.

You can opt out from periodically reading from `sessionStorage` using the `useSessionStorageNoSync()` hook instead. Read more about this in [Disable syncing](#disable-syncing).

## Disable syncing

In case you don't want the hook to automatically react to changes in `sessionStorage`, you can import and use the `useSessionStorageNoSync()` hook, which lets you use `sessionStorage` without continuous synchronization. The `useSessionStorageNoSync()` hook returns an array of two elements:

- the first element is a function that returns value stored in `sessionStorage`. This triggers synchronization on demand (when you call it, typically when the component renders).

- the second element is a function which can be called with a value that will be stored in `sessionStorage`. If you call this function without an argument, the `sessionStorage` entry will be removed.

The key to the `sessionStorage` entry you want to access must be supplied to the hook as its first argument:

```jsx
import React from 'react'
import {useSessionStorageNoSync as useSessionStorage} from 'react-hook-session-web-storage'

const ComponentWithSessionStorage = () => {
  const [getValue, setValue] = useSessionStorage('myKey')

  return (
    <div className="App">
      <p>Value in SessionStorage: {getValue()}</p>
      <button
        onClick={() => setValue('Value from hook')}
      >
        Set value with hook
      </button>
      <button
        onClick={() => setValue()}
      >
        Unset value
      </button>
    </div>
  )
}
```

## Limitations

`sessionStorage` is using the Storage interface of the Web Storage API that requires all keys and values to be strings.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## Licence

LGPL-3.0
