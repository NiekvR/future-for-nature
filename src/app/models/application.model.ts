export interface Application {
  id?: string;
  ffnId: string;
  name: Name;
  postalAddress: PostalAddress;
  nationality: string;
  countryOfWork: string;
  focalSpecies: string;
  scientificName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  nativeLanguage: string;
  achievements: string;
  contributionsMade: string;
  englishProficiency: string;
  email: string;
  telephoneNumber: string;
  formalEducation: string;
  employmentRecord: string;
  formerApplications: string;
  otherAwards: string;
  inspiration: string;
  problems: string;
  vision: string;
  addedValue: string;
  additionalInformation: string;
  referee: Referee[];
}

export interface Name {
  firstName: string;
  middleName: string;
  surName: string;
  suffix: string;
  prefix: string;
  fullName: string;
}

export interface Referee {
  name: Name;
  organisation: string;
  position: string;
  statement: string;
}

export interface PostalAddress {
  streetAddress: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}
