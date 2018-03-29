

exports.getTodaysDate = () => {
  const start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  const end = new Date();
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  return {
    start,
    end,
  };
};
