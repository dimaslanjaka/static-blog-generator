class is {
  static url(url) {
    try {
      return new URL(url);
    } catch (error) {
      return false;
    }
  }
}

exports = is;
