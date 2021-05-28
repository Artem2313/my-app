function sendUserData(data: UserData, requestHeaders: Record<string, string>) {
  const {email, name, consent} = data.user;
  const storageData = localStorage.getItem('pg_inputs');

  let user;

  if (storageData) {
    const userData = JSON.parse(storageData);

    let jointApplicantData: Record<string, string | number | undefined> = {
      dob: '-',
      country: '-',
      fixMonth: '-',
      VarMonth: '-',
      cPayment: '-',
      holdingCpf: '-',
      creditMin: '-',
      carLoans: '-',
      homeLoans: '-',
      otherC: '-',
      otherProperties: '-',
      otherHomes: '-'
    };

    const propertyType: PropertyType = userData.propertyType;
    const purchaseTime = OPTIONS.find((option) => option.value === userData.urgency)?.label;

    const propertyValue = Math.round(getMaxCost(userData));
    const infos = getInfos(userData);
    const term = getTerm(getMaxTerm(userData.propertyType), ...infos);
    const percent = getLTV(userData);
    const monthlyPayment = Math.round(PMT(RATE / 12, term * 12, propertyValue * ltv));
    const isMSROverLimit = isMSRLimitExceeded(userData);
    const isOverLimit = isMSROverLimit || isTDSRLimitExceeded(userData);
    const cash = isOverLimit
      ? getTotalCash(...infos)
      : Math.round(propertyValue * getCashPart(userData));
    const cpf = isOverLimit
      ? getTotalCpf(...infos)
      : Math.round(propertyValue * getCpfPart(userData));
    const totalPayment = cash + cpf;



    const getApplicationData = (data: Record<string, string>) => ({
      dob: data.birthYear,
      country: country_TYPES[data.country],
      fixMonth: formatDigits(data.incomeFixed, true),
      VarMonth: formatDigits(
        Math.round(Number(data.incomeVariable) * 0.75),
        true
      ),
      cPayment: formatDigits(data.asideCash, true),
      holdingCpf: formatDigits(data.asideCpf, true),
      creditMin: formatDigits(data.paysCreditCard, true),
      carLoans: formatDigits(data.paysCarLoans, true),
      homeLoans: formatDigits(data.paysHomeLoans, true),
      otherC: formatDigits(data.paysOther, true),
      otherProperties: data.numberOfotherProperties,
      otherHomes: data.numberOfotherHomes
    });

    const applicantData = getApplicationData(userData.me);

    user = {
      name: name,
      email: email,
      propertyValue: formatDigits(propertyValue, true),
      loanAmount: isOverLimit ? 'N/A' : formatDigits(propertyValue - totalPayment, true),
      estMonthly: isOverLimit ? 'N/A' : formatDigits(monthlyPayment, true),
      percent: percent * 100 + '%',
      totalPayment: formatDigits(totalPayment, true),
      mincPayment: formatDigits(cash, true),
      remainingDownpayment: formatDigits(cpf, true),
      propertyType: PROPERTY_TYPES[propertyType],
      searchStage: userData.propertyProgress,
      purchaseTime: purchaseTime,
      purchaseType: PURCHASE_TYPES[userData.applicant],
      totalJointMonthlyIncome: formatDigits(totalJointMonthlyIncome, true),
      totalJointFunds: formatDigits(totalJointFunds, true),
      marketingConsent: consent,
      totalJointMonthlyCommitments: formatDigits(totalJointMonthlyCommitments, true),
      applicantData
    };
  }

  return postJSON(FetchUrl('www.example.com'), user, requestHeaders);
}
