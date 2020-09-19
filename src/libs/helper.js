export const emailToKey = email => {
    // replace . to # to make email as key
    return email.replace(/\./g, ",");
  };