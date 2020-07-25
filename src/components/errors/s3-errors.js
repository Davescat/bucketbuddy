class NetworkError extends Error {
  constructor() {
    super(
      'We are unable to establish a connection due to the network. Please validate your connection and try again.'
    );
    this.name = 'NetworkError';
  }
}

class ForbiddenError extends Error {
  constructor() {
    super(
      'We are unable to establish a connection. Please validate your credentials and try again.'
    );
    this.name = 'ForbiddenError';
  }
}

class GenericS3Error extends Error {
  constructor() {
    super(
      'Hmm... There appears to be an issue creating a connection to the bucket (however we are not sure why). Please try again.'
    );
    this.name = 'GenericS3Error';
  }
}

export { GenericS3Error, ForbiddenError, NetworkError };
