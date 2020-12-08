export const username = {
  required: 'Username is required',
  maxLength: {
    value: 20,
    message: 'Username too long'
  },
  minLength: {
    value: 3,
    message: 'Username too short'
  },
  pattern: {
    value: /^(?!_)(?!.*_{2})[a-zA-Z0-9_]+(?<![_])$/,
    message: 'Invalid characters'
  }
}

export const password = {
  required: 'Password is required!',
  minLength: {
    value: 8,
    message: 'Password too short'
  },
  pattern: {
    value: /^[a-zA-Z0-9]+$/,
    message: 'Invalid characters'
  }
}

export const email = {
  required: 'Email is required!',
  pattern: {
    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: 'Invalid email'
  }
}