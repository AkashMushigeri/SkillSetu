# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `skillsetu`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListCompanies*](#listcompanies)
  - [*GetCompany*](#getcompany)
  - [*GetMyCompany*](#getmycompany)
  - [*GetMyCollege*](#getmycollege)
  - [*GetMyEducation*](#getmyeducation)
  - [*ListColleges*](#listcolleges)
  - [*GetMyProfile*](#getmyprofile)
  - [*SearchCandidates*](#searchcandidates)
  - [*GetCandidateProfile*](#getcandidateprofile)
  - [*ListJobs*](#listjobs)
  - [*ListInternships*](#listinternships)
  - [*ListMyApplications*](#listmyapplications)
  - [*ListCompanyApplications*](#listcompanyapplications)
  - [*ListMyInterviews*](#listmyinterviews)
  - [*ListCompanyInterviews*](#listcompanyinterviews)
  - [*ListChallenges*](#listchallenges)
  - [*GetChallenge*](#getchallenge)
  - [*ListChallengeSubmissions*](#listchallengesubmissions)
  - [*ListMyOffers*](#listmyoffers)
  - [*ListMoUs*](#listmous)
  - [*ListMoUsForCollege*](#listmousforcollege)
  - [*ListSkills*](#listskills)
  - [*ListMySkills*](#listmyskills)
  - [*ListCompanyJobs*](#listcompanyjobs)
  - [*ListCompanyInternships*](#listcompanyinternships)
  - [*ListCompanyChallenges*](#listcompanychallenges)
- [**Mutations**](#mutations)
  - [*UpsertStudentProfile*](#upsertstudentprofile)
  - [*UpsertUserProfile*](#upsertuserprofile)
  - [*UpsertCompany*](#upsertcompany)
  - [*UpdateMyCompany*](#updatemycompany)
  - [*UpsertCollege*](#upsertcollege)
  - [*CreateMyCollege*](#createmycollege)
  - [*UpdateMyCollege*](#updatemycollege)
  - [*CreateSkill*](#createskill)
  - [*UpsertUserSkill*](#upsertuserskill)
  - [*CreateCandidateProject*](#createcandidateproject)
  - [*CreateCandidateExperience*](#createcandidateexperience)
  - [*CreateCandidateEducation*](#createcandidateeducation)
  - [*CreateProfileEducation*](#createprofileeducation)
  - [*UpdateMyProfileEducation*](#updatemyprofileeducation)
  - [*DeleteMyDuplicateEducation*](#deletemyduplicateeducation)
  - [*CreateJob*](#createjob)
  - [*UpsertJobRequiredSkill*](#upsertjobrequiredskill)
  - [*CreateInternship*](#createinternship)
  - [*UpsertInternshipRequiredSkill*](#upsertinternshiprequiredskill)
  - [*CreateApplication*](#createapplication)
  - [*UpdateApplicationStage*](#updateapplicationstage)
  - [*CreateInterview*](#createinterview)
  - [*CreateChallenge*](#createchallenge)
  - [*CreateChallengeSubmission*](#createchallengesubmission)
  - [*CreateOffer*](#createoffer)
  - [*CreateCurriculumModule*](#createcurriculummodule)
  - [*UpsertHiringPreferences*](#upserthiringpreferences)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `skillsetu`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@skillsetu/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `skillsetu` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListCompanies
You can execute the `ListCompanies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCompanies(options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;

interface ListCompaniesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCompaniesData, undefined>;
}
export const listCompaniesRef: ListCompaniesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;

interface ListCompaniesRef {
  ...
  (dc: DataConnect): QueryRef<ListCompaniesData, undefined>;
}
export const listCompaniesRef: ListCompaniesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompaniesRef:
```typescript
const name = listCompaniesRef.operationName;
console.log(name);
```

### Variables
The `ListCompanies` query has no variables.
### Return Type
Recall that executing the `ListCompanies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompaniesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompaniesData {
  companies: ({
    id: UUIDString;
    name: string;
    type?: string | null;
    industry?: string | null;
    location?: string | null;
    employees?: string | null;
    founded?: number | null;
    website?: string | null;
    tagline?: string | null;
    logo?: string | null;
    coverImage?: string | null;
  } & Company_Key)[];
}
```
### Using `ListCompanies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanies } from '@skillsetu/dataconnect';


// Call the `listCompanies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanies(dataConnect);

console.log(data.companies);

// Or, you can use the `Promise` API.
listCompanies().then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

### Using `ListCompanies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompaniesRef } from '@skillsetu/dataconnect';


// Call the `listCompaniesRef()` function to get a reference to the query.
const ref = listCompaniesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompaniesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.companies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

## GetCompany
You can execute the `GetCompany` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getCompany(vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;

interface GetCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
}
export const getCompanyRef: GetCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompany(dc: DataConnect, vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;

interface GetCompanyRef {
  ...
  (dc: DataConnect, vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
}
export const getCompanyRef: GetCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCompanyRef:
```typescript
const name = getCompanyRef.operationName;
console.log(name);
```

### Variables
The `GetCompany` query requires an argument of type `GetCompanyVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCompanyVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetCompany` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCompanyData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCompanyData {
  company?: {
    id: UUIDString;
    name: string;
    type?: string | null;
    industry?: string | null;
    location?: string | null;
    coordinates?: unknown | null;
    employees?: string | null;
    founded?: number | null;
    website?: string | null;
    tagline?: string | null;
    about?: string | null;
    mission?: string | null;
    techStack?: string[] | null;
    departments?: string[] | null;
    hiringDomains?: string[] | null;
    benefits?: string[] | null;
    culture?: string[] | null;
    logo?: string | null;
    coverImage?: string | null;
    jobs_on_company: ({
      id: UUIDString;
      title: string;
      location?: string | null;
      workMode?: string | null;
      jobType?: string | null;
      salaryRange?: string | null;
      status?: string | null;
      postedDate: TimestampString;
    } & Job_Key)[];
    internships_on_company: ({
      id: UUIDString;
      title: string;
      location?: string | null;
      workMode?: string | null;
      duration?: string | null;
      stipend?: string | null;
      status?: string | null;
      postedDate: TimestampString;
    } & Internship_Key)[];
  } & Company_Key;
}
```
### Using `GetCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompany, GetCompanyVariables } from '@skillsetu/dataconnect';

// The `GetCompany` query requires an argument of type `GetCompanyVariables`:
const getCompanyVars: GetCompanyVariables = {
  id: ..., 
};

// Call the `getCompany()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompany(getCompanyVars);
// Variables can be defined inline as well.
const { data } = await getCompany({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompany(dataConnect, getCompanyVars);

console.log(data.company);

// Or, you can use the `Promise` API.
getCompany(getCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company);
});
```

### Using `GetCompany`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCompanyRef, GetCompanyVariables } from '@skillsetu/dataconnect';

// The `GetCompany` query requires an argument of type `GetCompanyVariables`:
const getCompanyVars: GetCompanyVariables = {
  id: ..., 
};

// Call the `getCompanyRef()` function to get a reference to the query.
const ref = getCompanyRef(getCompanyVars);
// Variables can be defined inline as well.
const ref = getCompanyRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCompanyRef(dataConnect, getCompanyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.company);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.company);
});
```

## GetMyCompany
You can execute the `GetMyCompany` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyCompany(options?: ExecuteQueryOptions): QueryPromise<GetMyCompanyData, undefined>;

interface GetMyCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCompanyData, undefined>;
}
export const getMyCompanyRef: GetMyCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyCompany(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCompanyData, undefined>;

interface GetMyCompanyRef {
  ...
  (dc: DataConnect): QueryRef<GetMyCompanyData, undefined>;
}
export const getMyCompanyRef: GetMyCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyCompanyRef:
```typescript
const name = getMyCompanyRef.operationName;
console.log(name);
```

### Variables
The `GetMyCompany` query has no variables.
### Return Type
Recall that executing the `GetMyCompany` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyCompanyData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyCompanyData {
  companies: ({
    id: UUIDString;
  } & Company_Key)[];
}
```
### Using `GetMyCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyCompany } from '@skillsetu/dataconnect';


// Call the `getMyCompany()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyCompany();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyCompany(dataConnect);

console.log(data.companies);

// Or, you can use the `Promise` API.
getMyCompany().then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

### Using `GetMyCompany`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyCompanyRef } from '@skillsetu/dataconnect';


// Call the `getMyCompanyRef()` function to get a reference to the query.
const ref = getMyCompanyRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyCompanyRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.companies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

## GetMyCollege
You can execute the `GetMyCollege` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyCollege(options?: ExecuteQueryOptions): QueryPromise<GetMyCollegeData, undefined>;

interface GetMyCollegeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCollegeData, undefined>;
}
export const getMyCollegeRef: GetMyCollegeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyCollege(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCollegeData, undefined>;

interface GetMyCollegeRef {
  ...
  (dc: DataConnect): QueryRef<GetMyCollegeData, undefined>;
}
export const getMyCollegeRef: GetMyCollegeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyCollegeRef:
```typescript
const name = getMyCollegeRef.operationName;
console.log(name);
```

### Variables
The `GetMyCollege` query has no variables.
### Return Type
Recall that executing the `GetMyCollege` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyCollegeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyCollegeData {
  colleges: ({
    id: UUIDString;
  } & College_Key)[];
}
```
### Using `GetMyCollege`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyCollege } from '@skillsetu/dataconnect';


// Call the `getMyCollege()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyCollege();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyCollege(dataConnect);

console.log(data.colleges);

// Or, you can use the `Promise` API.
getMyCollege().then((response) => {
  const data = response.data;
  console.log(data.colleges);
});
```

### Using `GetMyCollege`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyCollegeRef } from '@skillsetu/dataconnect';


// Call the `getMyCollegeRef()` function to get a reference to the query.
const ref = getMyCollegeRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyCollegeRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.colleges);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.colleges);
});
```

## GetMyEducation
You can execute the `GetMyEducation` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyEducation(options?: ExecuteQueryOptions): QueryPromise<GetMyEducationData, undefined>;

interface GetMyEducationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyEducationData, undefined>;
}
export const getMyEducationRef: GetMyEducationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyEducation(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyEducationData, undefined>;

interface GetMyEducationRef {
  ...
  (dc: DataConnect): QueryRef<GetMyEducationData, undefined>;
}
export const getMyEducationRef: GetMyEducationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyEducationRef:
```typescript
const name = getMyEducationRef.operationName;
console.log(name);
```

### Variables
The `GetMyEducation` query has no variables.
### Return Type
Recall that executing the `GetMyEducation` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyEducationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyEducationData {
  user?: {
    candidateEducations_on_user: ({
      id: UUIDString;
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    } & CandidateEducation_Key)[];
  };
}
```
### Using `GetMyEducation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyEducation } from '@skillsetu/dataconnect';


// Call the `getMyEducation()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyEducation();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyEducation(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyEducation().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyEducation`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyEducationRef } from '@skillsetu/dataconnect';


// Call the `getMyEducationRef()` function to get a reference to the query.
const ref = getMyEducationRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyEducationRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListColleges
You can execute the `ListColleges` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listColleges(options?: ExecuteQueryOptions): QueryPromise<ListCollegesData, undefined>;

interface ListCollegesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCollegesData, undefined>;
}
export const listCollegesRef: ListCollegesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listColleges(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCollegesData, undefined>;

interface ListCollegesRef {
  ...
  (dc: DataConnect): QueryRef<ListCollegesData, undefined>;
}
export const listCollegesRef: ListCollegesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCollegesRef:
```typescript
const name = listCollegesRef.operationName;
console.log(name);
```

### Variables
The `ListColleges` query has no variables.
### Return Type
Recall that executing the `ListColleges` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCollegesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCollegesData {
  colleges: ({
    id: UUIDString;
    name: string;
    location?: string | null;
    studentsCount?: number | null;
    verifiedStudentsCount?: number | null;
    placementReadiness?: number | null;
    partnershipStatus?: CollegePartnershipStatus | null;
    contactPerson?: string | null;
    contactEmail?: string | null;
  } & College_Key)[];
}
```
### Using `ListColleges`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listColleges } from '@skillsetu/dataconnect';


// Call the `listColleges()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listColleges();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listColleges(dataConnect);

console.log(data.colleges);

// Or, you can use the `Promise` API.
listColleges().then((response) => {
  const data = response.data;
  console.log(data.colleges);
});
```

### Using `ListColleges`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCollegesRef } from '@skillsetu/dataconnect';


// Call the `listCollegesRef()` function to get a reference to the query.
const ref = listCollegesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCollegesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.colleges);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.colleges);
});
```

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyProfileData {
  user?: {
    uid: string;
    displayName: string;
    email: string;
    photoUrl?: string | null;
    role: UserRole;
    college?: string | null;
    location?: string | null;
    phone?: string | null;
    candidateSkills: ({
      level: SkillLevel;
      verified: boolean;
      score?: number | null;
      skill: {
        name: string;
        category?: string | null;
      };
    })[];
    candidateProjects_on_user: ({
      id: UUIDString;
      title: string;
      description?: string | null;
      technologies?: string[] | null;
      githubUrl?: string | null;
      liveUrl?: string | null;
      createdAt: TimestampString;
    } & CandidateProject_Key)[];
    candidateExperiences_on_user: ({
      id: UUIDString;
      title: string;
      company: string;
      duration?: string | null;
      description?: string | null;
      location?: string | null;
      startDate?: TimestampString | null;
      endDate?: TimestampString | null;
    } & CandidateExperience_Key)[];
    candidateEducations_on_user: ({
      id: UUIDString;
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    } & CandidateEducation_Key)[];
  } & User_Key;
}
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@skillsetu/dataconnect';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@skillsetu/dataconnect';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## SearchCandidates
You can execute the `SearchCandidates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
searchCandidates(vars?: SearchCandidatesVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCandidatesData, SearchCandidatesVariables>;

interface SearchCandidatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchCandidatesVariables): QueryRef<SearchCandidatesData, SearchCandidatesVariables>;
}
export const searchCandidatesRef: SearchCandidatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchCandidates(dc: DataConnect, vars?: SearchCandidatesVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCandidatesData, SearchCandidatesVariables>;

interface SearchCandidatesRef {
  ...
  (dc: DataConnect, vars?: SearchCandidatesVariables): QueryRef<SearchCandidatesData, SearchCandidatesVariables>;
}
export const searchCandidatesRef: SearchCandidatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchCandidatesRef:
```typescript
const name = searchCandidatesRef.operationName;
console.log(name);
```

### Variables
The `SearchCandidates` query has an optional argument of type `SearchCandidatesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchCandidatesVariables {
  skillNames?: string[] | null;
}
```
### Return Type
Recall that executing the `SearchCandidates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchCandidatesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchCandidatesData {
  candidates: ({
    uid: string;
    displayName: string;
    email: string;
    photoUrl?: string | null;
    college?: string | null;
    location?: string | null;
    filteredSkills: ({
      level: SkillLevel;
      verified: boolean;
      score?: number | null;
      skill: {
        name: string;
      };
    })[];
    candidateProjects_on_user: ({
      title: string;
      description?: string | null;
      technologies?: string[] | null;
      githubUrl?: string | null;
      liveUrl?: string | null;
    })[];
    candidateEducations_on_user: ({
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    })[];
  } & User_Key)[];
}
```
### Using `SearchCandidates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchCandidates, SearchCandidatesVariables } from '@skillsetu/dataconnect';

// The `SearchCandidates` query has an optional argument of type `SearchCandidatesVariables`:
const searchCandidatesVars: SearchCandidatesVariables = {
  skillNames: ..., // optional
};

// Call the `searchCandidates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchCandidates(searchCandidatesVars);
// Variables can be defined inline as well.
const { data } = await searchCandidates({ skillNames: ..., });
// Since all variables are optional for this query, you can omit the `SearchCandidatesVariables` argument.
const { data } = await searchCandidates();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchCandidates(dataConnect, searchCandidatesVars);

console.log(data.candidates);

// Or, you can use the `Promise` API.
searchCandidates(searchCandidatesVars).then((response) => {
  const data = response.data;
  console.log(data.candidates);
});
```

### Using `SearchCandidates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchCandidatesRef, SearchCandidatesVariables } from '@skillsetu/dataconnect';

// The `SearchCandidates` query has an optional argument of type `SearchCandidatesVariables`:
const searchCandidatesVars: SearchCandidatesVariables = {
  skillNames: ..., // optional
};

// Call the `searchCandidatesRef()` function to get a reference to the query.
const ref = searchCandidatesRef(searchCandidatesVars);
// Variables can be defined inline as well.
const ref = searchCandidatesRef({ skillNames: ..., });
// Since all variables are optional for this query, you can omit the `SearchCandidatesVariables` argument.
const ref = searchCandidatesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchCandidatesRef(dataConnect, searchCandidatesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.candidates);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.candidates);
});
```

## GetCandidateProfile
You can execute the `GetCandidateProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getCandidateProfile(vars: GetCandidateProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCandidateProfileData, GetCandidateProfileVariables>;

interface GetCandidateProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCandidateProfileVariables): QueryRef<GetCandidateProfileData, GetCandidateProfileVariables>;
}
export const getCandidateProfileRef: GetCandidateProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCandidateProfile(dc: DataConnect, vars: GetCandidateProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCandidateProfileData, GetCandidateProfileVariables>;

interface GetCandidateProfileRef {
  ...
  (dc: DataConnect, vars: GetCandidateProfileVariables): QueryRef<GetCandidateProfileData, GetCandidateProfileVariables>;
}
export const getCandidateProfileRef: GetCandidateProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCandidateProfileRef:
```typescript
const name = getCandidateProfileRef.operationName;
console.log(name);
```

### Variables
The `GetCandidateProfile` query requires an argument of type `GetCandidateProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCandidateProfileVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetCandidateProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCandidateProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCandidateProfileData {
  user?: {
    uid: string;
    displayName: string;
    role: UserRole;
    email: string;
    photoUrl?: string | null;
    college?: string | null;
    location?: string | null;
    phone?: string | null;
    candidateSkills: ({
      level: SkillLevel;
      verified: boolean;
      score?: number | null;
      verificationDate?: TimestampString | null;
      verifiedBy?: string | null;
      badgeUrl?: string | null;
      skill: {
        name: string;
        category?: string | null;
      };
    })[];
    candidateProjects_on_user: ({
      id: UUIDString;
      title: string;
      description?: string | null;
      technologies?: string[] | null;
      githubUrl?: string | null;
      liveUrl?: string | null;
      createdAt: TimestampString;
    } & CandidateProject_Key)[];
    candidateExperiences_on_user: ({
      id: UUIDString;
      title: string;
      company: string;
      duration?: string | null;
      description?: string | null;
      location?: string | null;
      startDate?: TimestampString | null;
      endDate?: TimestampString | null;
    } & CandidateExperience_Key)[];
    candidateEducations_on_user: ({
      id: UUIDString;
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    } & CandidateEducation_Key)[];
  } & User_Key;
}
```
### Using `GetCandidateProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCandidateProfile, GetCandidateProfileVariables } from '@skillsetu/dataconnect';

// The `GetCandidateProfile` query requires an argument of type `GetCandidateProfileVariables`:
const getCandidateProfileVars: GetCandidateProfileVariables = {
  uid: ..., 
};

// Call the `getCandidateProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCandidateProfile(getCandidateProfileVars);
// Variables can be defined inline as well.
const { data } = await getCandidateProfile({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCandidateProfile(dataConnect, getCandidateProfileVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getCandidateProfile(getCandidateProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCandidateProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCandidateProfileRef, GetCandidateProfileVariables } from '@skillsetu/dataconnect';

// The `GetCandidateProfile` query requires an argument of type `GetCandidateProfileVariables`:
const getCandidateProfileVars: GetCandidateProfileVariables = {
  uid: ..., 
};

// Call the `getCandidateProfileRef()` function to get a reference to the query.
const ref = getCandidateProfileRef(getCandidateProfileVars);
// Variables can be defined inline as well.
const ref = getCandidateProfileRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCandidateProfileRef(dataConnect, getCandidateProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListJobs
You can execute the `ListJobs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listJobs(options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface ListJobsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobsData, undefined>;
}
export const listJobsRef: ListJobsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface ListJobsRef {
  ...
  (dc: DataConnect): QueryRef<ListJobsData, undefined>;
}
export const listJobsRef: ListJobsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJobsRef:
```typescript
const name = listJobsRef.operationName;
console.log(name);
```

### Variables
The `ListJobs` query has no variables.
### Return Type
Recall that executing the `ListJobs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJobsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListJobsData {
  jobs: ({
    id: UUIDString;
    title: string;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
      location?: string | null;
      coordinates?: unknown | null;
    } & Company_Key;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    jobType?: string | null;
    salaryRange?: string | null;
    experienceRequired?: string | null;
    minimumCgpa?: number | null;
    jobRequiredSkills_on_job: ({
      level: SkillLevel;
      importance: SkillImportance;
      minScore?: number | null;
      skill: {
        name: string;
      };
    })[];
    deadline?: TimestampString | null;
    openings?: number | null;
    applicationsCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
  } & Job_Key)[];
}
```
### Using `ListJobs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJobs } from '@skillsetu/dataconnect';


// Call the `listJobs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJobs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJobs(dataConnect);

console.log(data.jobs);

// Or, you can use the `Promise` API.
listJobs().then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

### Using `ListJobs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJobsRef } from '@skillsetu/dataconnect';


// Call the `listJobsRef()` function to get a reference to the query.
const ref = listJobsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJobsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.jobs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

## ListInternships
You can execute the `ListInternships` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listInternships(options?: ExecuteQueryOptions): QueryPromise<ListInternshipsData, undefined>;

interface ListInternshipsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInternshipsData, undefined>;
}
export const listInternshipsRef: ListInternshipsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listInternships(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListInternshipsData, undefined>;

interface ListInternshipsRef {
  ...
  (dc: DataConnect): QueryRef<ListInternshipsData, undefined>;
}
export const listInternshipsRef: ListInternshipsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listInternshipsRef:
```typescript
const name = listInternshipsRef.operationName;
console.log(name);
```

### Variables
The `ListInternships` query has no variables.
### Return Type
Recall that executing the `ListInternships` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListInternshipsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListInternshipsData {
  internships: ({
    id: UUIDString;
    title: string;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
      location?: string | null;
      coordinates?: unknown | null;
    } & Company_Key;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    duration?: string | null;
    stipend?: string | null;
    eligibility?: string | null;
    startDate?: TimestampString | null;
    applicationDeadline?: TimestampString | null;
    internshipRequiredSkills_on_internship: ({
      level: SkillLevel;
      importance: SkillImportance;
      minScore?: number | null;
      skill: {
        name: string;
      };
    })[];
    openings?: number | null;
    isStartupFriendly?: boolean | null;
    eligibleForConversion?: boolean | null;
    applicationsCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
  } & Internship_Key)[];
}
```
### Using `ListInternships`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listInternships } from '@skillsetu/dataconnect';


// Call the `listInternships()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listInternships();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listInternships(dataConnect);

console.log(data.internships);

// Or, you can use the `Promise` API.
listInternships().then((response) => {
  const data = response.data;
  console.log(data.internships);
});
```

### Using `ListInternships`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listInternshipsRef } from '@skillsetu/dataconnect';


// Call the `listInternshipsRef()` function to get a reference to the query.
const ref = listInternshipsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listInternshipsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.internships);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.internships);
});
```

## ListMyApplications
You can execute the `ListMyApplications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMyApplications(options?: ExecuteQueryOptions): QueryPromise<ListMyApplicationsData, undefined>;

interface ListMyApplicationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyApplicationsData, undefined>;
}
export const listMyApplicationsRef: ListMyApplicationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyApplications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyApplicationsData, undefined>;

interface ListMyApplicationsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyApplicationsData, undefined>;
}
export const listMyApplicationsRef: ListMyApplicationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyApplicationsRef:
```typescript
const name = listMyApplicationsRef.operationName;
console.log(name);
```

### Variables
The `ListMyApplications` query has no variables.
### Return Type
Recall that executing the `ListMyApplications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyApplicationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyApplicationsData {
  applications: ({
    id: UUIDString;
    company: {
      id: UUIDString;
      name: string;
    } & Company_Key;
    jobId?: string | null;
    internshipId?: string | null;
    title: string;
    jobType: string;
    matchScore?: number | null;
    appliedDate: TimestampString;
    stage: ApplicationStage;
    matchedSkills?: string[] | null;
    missingSkills?: string[] | null;
    interviewId?: string | null;
  } & Application_Key)[];
}
```
### Using `ListMyApplications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyApplications } from '@skillsetu/dataconnect';


// Call the `listMyApplications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyApplications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyApplications(dataConnect);

console.log(data.applications);

// Or, you can use the `Promise` API.
listMyApplications().then((response) => {
  const data = response.data;
  console.log(data.applications);
});
```

### Using `ListMyApplications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyApplicationsRef } from '@skillsetu/dataconnect';


// Call the `listMyApplicationsRef()` function to get a reference to the query.
const ref = listMyApplicationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyApplicationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.applications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.applications);
});
```

## ListCompanyApplications
You can execute the `ListCompanyApplications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCompanyApplications(vars: ListCompanyApplicationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;

interface ListCompanyApplicationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyApplicationsVariables): QueryRef<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
}
export const listCompanyApplicationsRef: ListCompanyApplicationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanyApplications(dc: DataConnect, vars: ListCompanyApplicationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;

interface ListCompanyApplicationsRef {
  ...
  (dc: DataConnect, vars: ListCompanyApplicationsVariables): QueryRef<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
}
export const listCompanyApplicationsRef: ListCompanyApplicationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompanyApplicationsRef:
```typescript
const name = listCompanyApplicationsRef.operationName;
console.log(name);
```

### Variables
The `ListCompanyApplications` query requires an argument of type `ListCompanyApplicationsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCompanyApplicationsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCompanyApplications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompanyApplicationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompanyApplicationsData {
  applications: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
      email: string;
      photoUrl?: string | null;
      college?: string | null;
      location?: string | null;
    } & User_Key;
    jobId?: string | null;
    internshipId?: string | null;
    title: string;
    jobType: string;
    matchScore?: number | null;
    appliedDate: TimestampString;
    stage: ApplicationStage;
    matchedSkills?: string[] | null;
    missingSkills?: string[] | null;
  } & Application_Key)[];
}
```
### Using `ListCompanyApplications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanyApplications, ListCompanyApplicationsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyApplications` query requires an argument of type `ListCompanyApplicationsVariables`:
const listCompanyApplicationsVars: ListCompanyApplicationsVariables = {
  companyId: ..., 
};

// Call the `listCompanyApplications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanyApplications(listCompanyApplicationsVars);
// Variables can be defined inline as well.
const { data } = await listCompanyApplications({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanyApplications(dataConnect, listCompanyApplicationsVars);

console.log(data.applications);

// Or, you can use the `Promise` API.
listCompanyApplications(listCompanyApplicationsVars).then((response) => {
  const data = response.data;
  console.log(data.applications);
});
```

### Using `ListCompanyApplications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompanyApplicationsRef, ListCompanyApplicationsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyApplications` query requires an argument of type `ListCompanyApplicationsVariables`:
const listCompanyApplicationsVars: ListCompanyApplicationsVariables = {
  companyId: ..., 
};

// Call the `listCompanyApplicationsRef()` function to get a reference to the query.
const ref = listCompanyApplicationsRef(listCompanyApplicationsVars);
// Variables can be defined inline as well.
const ref = listCompanyApplicationsRef({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompanyApplicationsRef(dataConnect, listCompanyApplicationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.applications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.applications);
});
```

## ListMyInterviews
You can execute the `ListMyInterviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMyInterviews(options?: ExecuteQueryOptions): QueryPromise<ListMyInterviewsData, undefined>;

interface ListMyInterviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyInterviewsData, undefined>;
}
export const listMyInterviewsRef: ListMyInterviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyInterviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyInterviewsData, undefined>;

interface ListMyInterviewsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyInterviewsData, undefined>;
}
export const listMyInterviewsRef: ListMyInterviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyInterviewsRef:
```typescript
const name = listMyInterviewsRef.operationName;
console.log(name);
```

### Variables
The `ListMyInterviews` query has no variables.
### Return Type
Recall that executing the `ListMyInterviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyInterviewsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyInterviewsData {
  interviews: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
    } & User_Key;
    company: {
      id: UUIDString;
      name: string;
    } & Company_Key;
    title: string;
    round: string;
    date: TimestampString;
    time: string;
    mode?: string | null;
    meetingLink?: string | null;
    interviewers?: string[] | null;
    status?: string | null;
    score?: number | null;
    createdAt: TimestampString;
  } & Interview_Key)[];
}
```
### Using `ListMyInterviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyInterviews } from '@skillsetu/dataconnect';


// Call the `listMyInterviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyInterviews();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyInterviews(dataConnect);

console.log(data.interviews);

// Or, you can use the `Promise` API.
listMyInterviews().then((response) => {
  const data = response.data;
  console.log(data.interviews);
});
```

### Using `ListMyInterviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyInterviewsRef } from '@skillsetu/dataconnect';


// Call the `listMyInterviewsRef()` function to get a reference to the query.
const ref = listMyInterviewsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyInterviewsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.interviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.interviews);
});
```

## ListCompanyInterviews
You can execute the `ListCompanyInterviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCompanyInterviews(vars: ListCompanyInterviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;

interface ListCompanyInterviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyInterviewsVariables): QueryRef<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
}
export const listCompanyInterviewsRef: ListCompanyInterviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanyInterviews(dc: DataConnect, vars: ListCompanyInterviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;

interface ListCompanyInterviewsRef {
  ...
  (dc: DataConnect, vars: ListCompanyInterviewsVariables): QueryRef<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
}
export const listCompanyInterviewsRef: ListCompanyInterviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompanyInterviewsRef:
```typescript
const name = listCompanyInterviewsRef.operationName;
console.log(name);
```

### Variables
The `ListCompanyInterviews` query requires an argument of type `ListCompanyInterviewsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCompanyInterviewsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCompanyInterviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompanyInterviewsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompanyInterviewsData {
  interviews: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
    } & User_Key;
    company: {
      id: UUIDString;
      name: string;
    } & Company_Key;
    title: string;
    round: string;
    date: TimestampString;
    time: string;
    mode?: string | null;
    meetingLink?: string | null;
    interviewers?: string[] | null;
    status?: string | null;
    score?: number | null;
    createdAt: TimestampString;
  } & Interview_Key)[];
}
```
### Using `ListCompanyInterviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanyInterviews, ListCompanyInterviewsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyInterviews` query requires an argument of type `ListCompanyInterviewsVariables`:
const listCompanyInterviewsVars: ListCompanyInterviewsVariables = {
  companyId: ..., 
};

// Call the `listCompanyInterviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanyInterviews(listCompanyInterviewsVars);
// Variables can be defined inline as well.
const { data } = await listCompanyInterviews({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanyInterviews(dataConnect, listCompanyInterviewsVars);

console.log(data.interviews);

// Or, you can use the `Promise` API.
listCompanyInterviews(listCompanyInterviewsVars).then((response) => {
  const data = response.data;
  console.log(data.interviews);
});
```

### Using `ListCompanyInterviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompanyInterviewsRef, ListCompanyInterviewsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyInterviews` query requires an argument of type `ListCompanyInterviewsVariables`:
const listCompanyInterviewsVars: ListCompanyInterviewsVariables = {
  companyId: ..., 
};

// Call the `listCompanyInterviewsRef()` function to get a reference to the query.
const ref = listCompanyInterviewsRef(listCompanyInterviewsVars);
// Variables can be defined inline as well.
const ref = listCompanyInterviewsRef({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompanyInterviewsRef(dataConnect, listCompanyInterviewsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.interviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.interviews);
});
```

## ListChallenges
You can execute the `ListChallenges` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listChallenges(options?: ExecuteQueryOptions): QueryPromise<ListChallengesData, undefined>;

interface ListChallengesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListChallengesData, undefined>;
}
export const listChallengesRef: ListChallengesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listChallenges(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListChallengesData, undefined>;

interface ListChallengesRef {
  ...
  (dc: DataConnect): QueryRef<ListChallengesData, undefined>;
}
export const listChallengesRef: ListChallengesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listChallengesRef:
```typescript
const name = listChallengesRef.operationName;
console.log(name);
```

### Variables
The `ListChallenges` query has no variables.
### Return Type
Recall that executing the `ListChallenges` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListChallengesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListChallengesData {
  challenges: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    difficulty?: string | null;
    deadline: TimestampString;
    teamSize?: string | null;
    prize?: string | null;
    participantsCount?: number | null;
    submissionsCount?: number | null;
    status: ChallengeStatus;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    requiredSkills?: string[] | null;
    createdDate: TimestampString;
  } & Challenge_Key)[];
}
```
### Using `ListChallenges`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listChallenges } from '@skillsetu/dataconnect';


// Call the `listChallenges()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listChallenges();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listChallenges(dataConnect);

console.log(data.challenges);

// Or, you can use the `Promise` API.
listChallenges().then((response) => {
  const data = response.data;
  console.log(data.challenges);
});
```

### Using `ListChallenges`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listChallengesRef } from '@skillsetu/dataconnect';


// Call the `listChallengesRef()` function to get a reference to the query.
const ref = listChallengesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listChallengesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.challenges);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.challenges);
});
```

## GetChallenge
You can execute the `GetChallenge` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getChallenge(vars: GetChallengeVariables, options?: ExecuteQueryOptions): QueryPromise<GetChallengeData, GetChallengeVariables>;

interface GetChallengeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetChallengeVariables): QueryRef<GetChallengeData, GetChallengeVariables>;
}
export const getChallengeRef: GetChallengeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getChallenge(dc: DataConnect, vars: GetChallengeVariables, options?: ExecuteQueryOptions): QueryPromise<GetChallengeData, GetChallengeVariables>;

interface GetChallengeRef {
  ...
  (dc: DataConnect, vars: GetChallengeVariables): QueryRef<GetChallengeData, GetChallengeVariables>;
}
export const getChallengeRef: GetChallengeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getChallengeRef:
```typescript
const name = getChallengeRef.operationName;
console.log(name);
```

### Variables
The `GetChallenge` query requires an argument of type `GetChallengeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetChallengeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetChallenge` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetChallengeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetChallengeData {
  challenge?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    problemStatement?: string | null;
    requiredSkills?: string[] | null;
    difficulty?: string | null;
    deadline: TimestampString;
    teamSize?: string | null;
    prize?: string | null;
    submissionRequirements?: string | null;
    collegeParticipation?: string | null;
    participantsCount?: number | null;
    submissionsCount?: number | null;
    status: ChallengeStatus;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    createdDate: TimestampString;
    createdAt: TimestampString;
  } & Challenge_Key;
}
```
### Using `GetChallenge`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getChallenge, GetChallengeVariables } from '@skillsetu/dataconnect';

// The `GetChallenge` query requires an argument of type `GetChallengeVariables`:
const getChallengeVars: GetChallengeVariables = {
  id: ..., 
};

// Call the `getChallenge()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getChallenge(getChallengeVars);
// Variables can be defined inline as well.
const { data } = await getChallenge({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getChallenge(dataConnect, getChallengeVars);

console.log(data.challenge);

// Or, you can use the `Promise` API.
getChallenge(getChallengeVars).then((response) => {
  const data = response.data;
  console.log(data.challenge);
});
```

### Using `GetChallenge`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getChallengeRef, GetChallengeVariables } from '@skillsetu/dataconnect';

// The `GetChallenge` query requires an argument of type `GetChallengeVariables`:
const getChallengeVars: GetChallengeVariables = {
  id: ..., 
};

// Call the `getChallengeRef()` function to get a reference to the query.
const ref = getChallengeRef(getChallengeVars);
// Variables can be defined inline as well.
const ref = getChallengeRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getChallengeRef(dataConnect, getChallengeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.challenge);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.challenge);
});
```

## ListChallengeSubmissions
You can execute the `ListChallengeSubmissions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listChallengeSubmissions(vars: ListChallengeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;

interface ListChallengeSubmissionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListChallengeSubmissionsVariables): QueryRef<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
}
export const listChallengeSubmissionsRef: ListChallengeSubmissionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listChallengeSubmissions(dc: DataConnect, vars: ListChallengeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;

interface ListChallengeSubmissionsRef {
  ...
  (dc: DataConnect, vars: ListChallengeSubmissionsVariables): QueryRef<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
}
export const listChallengeSubmissionsRef: ListChallengeSubmissionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listChallengeSubmissionsRef:
```typescript
const name = listChallengeSubmissionsRef.operationName;
console.log(name);
```

### Variables
The `ListChallengeSubmissions` query requires an argument of type `ListChallengeSubmissionsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListChallengeSubmissionsVariables {
  challengeId: UUIDString;
}
```
### Return Type
Recall that executing the `ListChallengeSubmissions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListChallengeSubmissionsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListChallengeSubmissionsData {
  challengeSubmissions: ({
    id: UUIDString;
    teamName: string;
    teamLeadUid: string;
    college?: string | null;
    submissionDate: TimestampString;
    githubUrl: string;
    liveDemoUrl?: string | null;
    videoUrl?: string | null;
    score?: number | null;
    testPassRate?: string | null;
    aiSummary?: string | null;
    status?: string | null;
    skillsDemonstrated?: string[] | null;
  } & ChallengeSubmission_Key)[];
}
```
### Using `ListChallengeSubmissions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listChallengeSubmissions, ListChallengeSubmissionsVariables } from '@skillsetu/dataconnect';

// The `ListChallengeSubmissions` query requires an argument of type `ListChallengeSubmissionsVariables`:
const listChallengeSubmissionsVars: ListChallengeSubmissionsVariables = {
  challengeId: ..., 
};

// Call the `listChallengeSubmissions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listChallengeSubmissions(listChallengeSubmissionsVars);
// Variables can be defined inline as well.
const { data } = await listChallengeSubmissions({ challengeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listChallengeSubmissions(dataConnect, listChallengeSubmissionsVars);

console.log(data.challengeSubmissions);

// Or, you can use the `Promise` API.
listChallengeSubmissions(listChallengeSubmissionsVars).then((response) => {
  const data = response.data;
  console.log(data.challengeSubmissions);
});
```

### Using `ListChallengeSubmissions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listChallengeSubmissionsRef, ListChallengeSubmissionsVariables } from '@skillsetu/dataconnect';

// The `ListChallengeSubmissions` query requires an argument of type `ListChallengeSubmissionsVariables`:
const listChallengeSubmissionsVars: ListChallengeSubmissionsVariables = {
  challengeId: ..., 
};

// Call the `listChallengeSubmissionsRef()` function to get a reference to the query.
const ref = listChallengeSubmissionsRef(listChallengeSubmissionsVars);
// Variables can be defined inline as well.
const ref = listChallengeSubmissionsRef({ challengeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listChallengeSubmissionsRef(dataConnect, listChallengeSubmissionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.challengeSubmissions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.challengeSubmissions);
});
```

## ListMyOffers
You can execute the `ListMyOffers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMyOffers(options?: ExecuteQueryOptions): QueryPromise<ListMyOffersData, undefined>;

interface ListMyOffersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyOffersData, undefined>;
}
export const listMyOffersRef: ListMyOffersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyOffers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyOffersData, undefined>;

interface ListMyOffersRef {
  ...
  (dc: DataConnect): QueryRef<ListMyOffersData, undefined>;
}
export const listMyOffersRef: ListMyOffersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyOffersRef:
```typescript
const name = listMyOffersRef.operationName;
console.log(name);
```

### Variables
The `ListMyOffers` query has no variables.
### Return Type
Recall that executing the `ListMyOffers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyOffersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyOffersData {
  offers: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
      email: string;
    } & User_Key;
    jobOrInternshipId?: string | null;
    roleTitle: string;
    type: string;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    compensation?: string | null;
    baseFixed?: string | null;
    variableBonus?: string | null;
    retentionJoiningBonus?: string | null;
    benefitsSummary?: string | null;
    joiningDate?: TimestampString | null;
    validUntil?: TimestampString | null;
    status?: OfferStatus | null;
    generatedDate: TimestampString;
    authorizedSignatory?: string | null;
    signatoryTitle?: string | null;
  } & Offer_Key)[];
}
```
### Using `ListMyOffers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyOffers } from '@skillsetu/dataconnect';


// Call the `listMyOffers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyOffers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyOffers(dataConnect);

console.log(data.offers);

// Or, you can use the `Promise` API.
listMyOffers().then((response) => {
  const data = response.data;
  console.log(data.offers);
});
```

### Using `ListMyOffers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyOffersRef } from '@skillsetu/dataconnect';


// Call the `listMyOffersRef()` function to get a reference to the query.
const ref = listMyOffersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyOffersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.offers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.offers);
});
```

## ListMoUs
You can execute the `ListMoUs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMoUs(options?: ExecuteQueryOptions): QueryPromise<ListMoUsData, undefined>;

interface ListMoUsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMoUsData, undefined>;
}
export const listMoUsRef: ListMoUsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMoUs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMoUsData, undefined>;

interface ListMoUsRef {
  ...
  (dc: DataConnect): QueryRef<ListMoUsData, undefined>;
}
export const listMoUsRef: ListMoUsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMoUsRef:
```typescript
const name = listMoUsRef.operationName;
console.log(name);
```

### Variables
The `ListMoUs` query has no variables.
### Return Type
Recall that executing the `ListMoUs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMoUsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMoUsData {
  collegeCompanies: ({
    college: {
      id: UUIDString;
      name: string;
      location?: string | null;
    } & College_Key;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    studentsCount?: number | null;
    internshipsOffered?: number | null;
    studentsHired?: number | null;
    activePrograms?: number | null;
    industryChallengesActive?: number | null;
    mouStatus?: MouStatus | null;
    curriculumModules_on_collegeCompany: ({
      semester: string;
      currentSubject: string;
      industryRecommendation?: string | null;
      recommendedTechnologies?: string[] | null;
      rationale?: string | null;
      status?: CurriculumStatus | null;
    })[];
  })[];
}
```
### Using `ListMoUs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMoUs } from '@skillsetu/dataconnect';


// Call the `listMoUs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMoUs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMoUs(dataConnect);

console.log(data.collegeCompanies);

// Or, you can use the `Promise` API.
listMoUs().then((response) => {
  const data = response.data;
  console.log(data.collegeCompanies);
});
```

### Using `ListMoUs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMoUsRef } from '@skillsetu/dataconnect';


// Call the `listMoUsRef()` function to get a reference to the query.
const ref = listMoUsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMoUsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collegeCompanies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collegeCompanies);
});
```

## ListMoUsForCollege
You can execute the `ListMoUsForCollege` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMoUsForCollege(options?: ExecuteQueryOptions): QueryPromise<ListMoUsForCollegeData, undefined>;

interface ListMoUsForCollegeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMoUsForCollegeData, undefined>;
}
export const listMoUsForCollegeRef: ListMoUsForCollegeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMoUsForCollege(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMoUsForCollegeData, undefined>;

interface ListMoUsForCollegeRef {
  ...
  (dc: DataConnect): QueryRef<ListMoUsForCollegeData, undefined>;
}
export const listMoUsForCollegeRef: ListMoUsForCollegeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMoUsForCollegeRef:
```typescript
const name = listMoUsForCollegeRef.operationName;
console.log(name);
```

### Variables
The `ListMoUsForCollege` query has no variables.
### Return Type
Recall that executing the `ListMoUsForCollege` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMoUsForCollegeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMoUsForCollegeData {
  collegeCompanies: ({
    college: {
      id: UUIDString;
      name: string;
      location?: string | null;
    } & College_Key;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    studentsCount?: number | null;
    internshipsOffered?: number | null;
    studentsHired?: number | null;
    activePrograms?: number | null;
    industryChallengesActive?: number | null;
    mouStatus?: MouStatus | null;
    curriculumModules_on_collegeCompany: ({
      semester: string;
      currentSubject: string;
      industryRecommendation?: string | null;
      recommendedTechnologies?: string[] | null;
      rationale?: string | null;
      status?: CurriculumStatus | null;
    })[];
  })[];
}
```
### Using `ListMoUsForCollege`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMoUsForCollege } from '@skillsetu/dataconnect';


// Call the `listMoUsForCollege()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMoUsForCollege();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMoUsForCollege(dataConnect);

console.log(data.collegeCompanies);

// Or, you can use the `Promise` API.
listMoUsForCollege().then((response) => {
  const data = response.data;
  console.log(data.collegeCompanies);
});
```

### Using `ListMoUsForCollege`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMoUsForCollegeRef } from '@skillsetu/dataconnect';


// Call the `listMoUsForCollegeRef()` function to get a reference to the query.
const ref = listMoUsForCollegeRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMoUsForCollegeRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.collegeCompanies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.collegeCompanies);
});
```

## ListSkills
You can execute the `ListSkills` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listSkills(options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;

interface ListSkillsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSkillsData, undefined>;
}
export const listSkillsRef: ListSkillsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;

interface ListSkillsRef {
  ...
  (dc: DataConnect): QueryRef<ListSkillsData, undefined>;
}
export const listSkillsRef: ListSkillsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSkillsRef:
```typescript
const name = listSkillsRef.operationName;
console.log(name);
```

### Variables
The `ListSkills` query has no variables.
### Return Type
Recall that executing the `ListSkills` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSkillsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSkillsData {
  skills: ({
    id: UUIDString;
    name: string;
    category?: string | null;
    description?: string | null;
  } & Skill_Key)[];
}
```
### Using `ListSkills`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSkills } from '@skillsetu/dataconnect';


// Call the `listSkills()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSkills();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSkills(dataConnect);

console.log(data.skills);

// Or, you can use the `Promise` API.
listSkills().then((response) => {
  const data = response.data;
  console.log(data.skills);
});
```

### Using `ListSkills`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSkillsRef } from '@skillsetu/dataconnect';


// Call the `listSkillsRef()` function to get a reference to the query.
const ref = listSkillsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSkillsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.skills);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.skills);
});
```

## ListMySkills
You can execute the `ListMySkills` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMySkills(options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;

interface ListMySkillsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMySkillsData, undefined>;
}
export const listMySkillsRef: ListMySkillsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMySkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;

interface ListMySkillsRef {
  ...
  (dc: DataConnect): QueryRef<ListMySkillsData, undefined>;
}
export const listMySkillsRef: ListMySkillsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMySkillsRef:
```typescript
const name = listMySkillsRef.operationName;
console.log(name);
```

### Variables
The `ListMySkills` query has no variables.
### Return Type
Recall that executing the `ListMySkills` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMySkillsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMySkillsData {
  userSkills: ({
    level: SkillLevel;
    verified: boolean;
    score?: number | null;
    verificationDate?: TimestampString | null;
    verifiedBy?: string | null;
    badgeUrl?: string | null;
    skill: {
      name: string;
      category?: string | null;
    };
  })[];
}
```
### Using `ListMySkills`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMySkills } from '@skillsetu/dataconnect';


// Call the `listMySkills()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMySkills();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMySkills(dataConnect);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
listMySkills().then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

### Using `ListMySkills`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMySkillsRef } from '@skillsetu/dataconnect';


// Call the `listMySkillsRef()` function to get a reference to the query.
const ref = listMySkillsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMySkillsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

## ListCompanyJobs
You can execute the `ListCompanyJobs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCompanyJobs(vars: ListCompanyJobsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyJobsData, ListCompanyJobsVariables>;

interface ListCompanyJobsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyJobsVariables): QueryRef<ListCompanyJobsData, ListCompanyJobsVariables>;
}
export const listCompanyJobsRef: ListCompanyJobsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanyJobs(dc: DataConnect, vars: ListCompanyJobsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyJobsData, ListCompanyJobsVariables>;

interface ListCompanyJobsRef {
  ...
  (dc: DataConnect, vars: ListCompanyJobsVariables): QueryRef<ListCompanyJobsData, ListCompanyJobsVariables>;
}
export const listCompanyJobsRef: ListCompanyJobsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompanyJobsRef:
```typescript
const name = listCompanyJobsRef.operationName;
console.log(name);
```

### Variables
The `ListCompanyJobs` query requires an argument of type `ListCompanyJobsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCompanyJobsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCompanyJobs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompanyJobsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompanyJobsData {
  jobs: ({
    id: UUIDString;
    title: string;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    jobType?: string | null;
    salaryRange?: string | null;
    experienceRequired?: string | null;
    minimumCgpa?: number | null;
    deadline?: TimestampString | null;
    openings?: number | null;
    applicationsCount?: number | null;
    shortlistedCount?: number | null;
    strongMatchesCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Job_Key)[];
}
```
### Using `ListCompanyJobs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanyJobs, ListCompanyJobsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyJobs` query requires an argument of type `ListCompanyJobsVariables`:
const listCompanyJobsVars: ListCompanyJobsVariables = {
  companyId: ..., 
};

// Call the `listCompanyJobs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanyJobs(listCompanyJobsVars);
// Variables can be defined inline as well.
const { data } = await listCompanyJobs({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanyJobs(dataConnect, listCompanyJobsVars);

console.log(data.jobs);

// Or, you can use the `Promise` API.
listCompanyJobs(listCompanyJobsVars).then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

### Using `ListCompanyJobs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompanyJobsRef, ListCompanyJobsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyJobs` query requires an argument of type `ListCompanyJobsVariables`:
const listCompanyJobsVars: ListCompanyJobsVariables = {
  companyId: ..., 
};

// Call the `listCompanyJobsRef()` function to get a reference to the query.
const ref = listCompanyJobsRef(listCompanyJobsVars);
// Variables can be defined inline as well.
const ref = listCompanyJobsRef({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompanyJobsRef(dataConnect, listCompanyJobsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.jobs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

## ListCompanyInternships
You can execute the `ListCompanyInternships` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCompanyInternships(vars: ListCompanyInternshipsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;

interface ListCompanyInternshipsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyInternshipsVariables): QueryRef<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
}
export const listCompanyInternshipsRef: ListCompanyInternshipsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanyInternships(dc: DataConnect, vars: ListCompanyInternshipsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;

interface ListCompanyInternshipsRef {
  ...
  (dc: DataConnect, vars: ListCompanyInternshipsVariables): QueryRef<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
}
export const listCompanyInternshipsRef: ListCompanyInternshipsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompanyInternshipsRef:
```typescript
const name = listCompanyInternshipsRef.operationName;
console.log(name);
```

### Variables
The `ListCompanyInternships` query requires an argument of type `ListCompanyInternshipsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCompanyInternshipsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCompanyInternships` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompanyInternshipsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompanyInternshipsData {
  internships: ({
    id: UUIDString;
    title: string;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    duration?: string | null;
    stipend?: string | null;
    eligibility?: string | null;
    startDate?: TimestampString | null;
    applicationDeadline?: TimestampString | null;
    openings?: number | null;
    isStartupFriendly?: boolean | null;
    eligibleForConversion?: boolean | null;
    applicationsCount?: number | null;
    shortlistedCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Internship_Key)[];
}
```
### Using `ListCompanyInternships`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanyInternships, ListCompanyInternshipsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyInternships` query requires an argument of type `ListCompanyInternshipsVariables`:
const listCompanyInternshipsVars: ListCompanyInternshipsVariables = {
  companyId: ..., 
};

// Call the `listCompanyInternships()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanyInternships(listCompanyInternshipsVars);
// Variables can be defined inline as well.
const { data } = await listCompanyInternships({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanyInternships(dataConnect, listCompanyInternshipsVars);

console.log(data.internships);

// Or, you can use the `Promise` API.
listCompanyInternships(listCompanyInternshipsVars).then((response) => {
  const data = response.data;
  console.log(data.internships);
});
```

### Using `ListCompanyInternships`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompanyInternshipsRef, ListCompanyInternshipsVariables } from '@skillsetu/dataconnect';

// The `ListCompanyInternships` query requires an argument of type `ListCompanyInternshipsVariables`:
const listCompanyInternshipsVars: ListCompanyInternshipsVariables = {
  companyId: ..., 
};

// Call the `listCompanyInternshipsRef()` function to get a reference to the query.
const ref = listCompanyInternshipsRef(listCompanyInternshipsVars);
// Variables can be defined inline as well.
const ref = listCompanyInternshipsRef({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompanyInternshipsRef(dataConnect, listCompanyInternshipsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.internships);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.internships);
});
```

## ListCompanyChallenges
You can execute the `ListCompanyChallenges` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listCompanyChallenges(vars: ListCompanyChallengesVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyChallengesData, ListCompanyChallengesVariables>;

interface ListCompanyChallengesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyChallengesVariables): QueryRef<ListCompanyChallengesData, ListCompanyChallengesVariables>;
}
export const listCompanyChallengesRef: ListCompanyChallengesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanyChallenges(dc: DataConnect, vars: ListCompanyChallengesVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyChallengesData, ListCompanyChallengesVariables>;

interface ListCompanyChallengesRef {
  ...
  (dc: DataConnect, vars: ListCompanyChallengesVariables): QueryRef<ListCompanyChallengesData, ListCompanyChallengesVariables>;
}
export const listCompanyChallengesRef: ListCompanyChallengesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompanyChallengesRef:
```typescript
const name = listCompanyChallengesRef.operationName;
console.log(name);
```

### Variables
The `ListCompanyChallenges` query requires an argument of type `ListCompanyChallengesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCompanyChallengesVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCompanyChallenges` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompanyChallengesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompanyChallengesData {
  challenges: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    difficulty?: string | null;
    deadline: TimestampString;
    teamSize?: string | null;
    prize?: string | null;
    participantsCount?: number | null;
    submissionsCount?: number | null;
    status: ChallengeStatus;
    createdDate: TimestampString;
    createdAt: TimestampString;
  } & Challenge_Key)[];
}
```
### Using `ListCompanyChallenges`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanyChallenges, ListCompanyChallengesVariables } from '@skillsetu/dataconnect';

// The `ListCompanyChallenges` query requires an argument of type `ListCompanyChallengesVariables`:
const listCompanyChallengesVars: ListCompanyChallengesVariables = {
  companyId: ..., 
};

// Call the `listCompanyChallenges()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanyChallenges(listCompanyChallengesVars);
// Variables can be defined inline as well.
const { data } = await listCompanyChallenges({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanyChallenges(dataConnect, listCompanyChallengesVars);

console.log(data.challenges);

// Or, you can use the `Promise` API.
listCompanyChallenges(listCompanyChallengesVars).then((response) => {
  const data = response.data;
  console.log(data.challenges);
});
```

### Using `ListCompanyChallenges`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompanyChallengesRef, ListCompanyChallengesVariables } from '@skillsetu/dataconnect';

// The `ListCompanyChallenges` query requires an argument of type `ListCompanyChallengesVariables`:
const listCompanyChallengesVars: ListCompanyChallengesVariables = {
  companyId: ..., 
};

// Call the `listCompanyChallengesRef()` function to get a reference to the query.
const ref = listCompanyChallengesRef(listCompanyChallengesVars);
// Variables can be defined inline as well.
const ref = listCompanyChallengesRef({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompanyChallengesRef(dataConnect, listCompanyChallengesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.challenges);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.challenges);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `skillsetu` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertStudentProfile
You can execute the `UpsertStudentProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertStudentProfile(vars: UpsertStudentProfileVariables): MutationPromise<UpsertStudentProfileData, UpsertStudentProfileVariables>;

interface UpsertStudentProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStudentProfileVariables): MutationRef<UpsertStudentProfileData, UpsertStudentProfileVariables>;
}
export const upsertStudentProfileRef: UpsertStudentProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertStudentProfile(dc: DataConnect, vars: UpsertStudentProfileVariables): MutationPromise<UpsertStudentProfileData, UpsertStudentProfileVariables>;

interface UpsertStudentProfileRef {
  ...
  (dc: DataConnect, vars: UpsertStudentProfileVariables): MutationRef<UpsertStudentProfileData, UpsertStudentProfileVariables>;
}
export const upsertStudentProfileRef: UpsertStudentProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertStudentProfileRef:
```typescript
const name = upsertStudentProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertStudentProfile` mutation requires an argument of type `UpsertStudentProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertStudentProfileVariables {
  displayName: string;
  email: string;
  photoUrl?: string | null;
  college?: string | null;
  location?: string | null;
  phone?: string | null;
}
```
### Return Type
Recall that executing the `UpsertStudentProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertStudentProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertStudentProfileData {
  user_upsert: User_Key;
}
```
### Using `UpsertStudentProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertStudentProfile, UpsertStudentProfileVariables } from '@skillsetu/dataconnect';

// The `UpsertStudentProfile` mutation requires an argument of type `UpsertStudentProfileVariables`:
const upsertStudentProfileVars: UpsertStudentProfileVariables = {
  displayName: ..., 
  email: ..., 
  photoUrl: ..., // optional
  college: ..., // optional
  location: ..., // optional
  phone: ..., // optional
};

// Call the `upsertStudentProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertStudentProfile(upsertStudentProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertStudentProfile({ displayName: ..., email: ..., photoUrl: ..., college: ..., location: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertStudentProfile(dataConnect, upsertStudentProfileVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertStudentProfile(upsertStudentProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertStudentProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertStudentProfileRef, UpsertStudentProfileVariables } from '@skillsetu/dataconnect';

// The `UpsertStudentProfile` mutation requires an argument of type `UpsertStudentProfileVariables`:
const upsertStudentProfileVars: UpsertStudentProfileVariables = {
  displayName: ..., 
  email: ..., 
  photoUrl: ..., // optional
  college: ..., // optional
  location: ..., // optional
  phone: ..., // optional
};

// Call the `upsertStudentProfileRef()` function to get a reference to the mutation.
const ref = upsertStudentProfileRef(upsertStudentProfileVars);
// Variables can be defined inline as well.
const ref = upsertStudentProfileRef({ displayName: ..., email: ..., photoUrl: ..., college: ..., location: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertStudentProfileRef(dataConnect, upsertStudentProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpsertUserProfile
You can execute the `UpsertUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertUserProfileRef {
  ...
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
}
export const upsertUserProfileRef: UpsertUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserProfileRef:
```typescript
const name = upsertUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserProfileVariables {
  displayName: string;
  email: string;
  role: UserRole;
  photoUrl?: string | null;
  college?: string | null;
  location?: string | null;
  phone?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserProfileData {
  user_upsert: User_Key;
}
```
### Using `UpsertUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfile, UpsertUserProfileVariables } from '@skillsetu/dataconnect';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  displayName: ..., 
  email: ..., 
  role: ..., 
  photoUrl: ..., // optional
  college: ..., // optional
  location: ..., // optional
  phone: ..., // optional
};

// Call the `upsertUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserProfile(upsertUserProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertUserProfile({ displayName: ..., email: ..., role: ..., photoUrl: ..., college: ..., location: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserProfile(dataConnect, upsertUserProfileVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUserProfile(upsertUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserProfileRef, UpsertUserProfileVariables } from '@skillsetu/dataconnect';

// The `UpsertUserProfile` mutation requires an argument of type `UpsertUserProfileVariables`:
const upsertUserProfileVars: UpsertUserProfileVariables = {
  displayName: ..., 
  email: ..., 
  role: ..., 
  photoUrl: ..., // optional
  college: ..., // optional
  location: ..., // optional
  phone: ..., // optional
};

// Call the `upsertUserProfileRef()` function to get a reference to the mutation.
const ref = upsertUserProfileRef(upsertUserProfileVars);
// Variables can be defined inline as well.
const ref = upsertUserProfileRef({ displayName: ..., email: ..., role: ..., photoUrl: ..., college: ..., location: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserProfileRef(dataConnect, upsertUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpsertCompany
You can execute the `UpsertCompany` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertCompany(vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;

interface UpsertCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
}
export const upsertCompanyRef: UpsertCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCompany(dc: DataConnect, vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;

interface UpsertCompanyRef {
  ...
  (dc: DataConnect, vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
}
export const upsertCompanyRef: UpsertCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCompanyRef:
```typescript
const name = upsertCompanyRef.operationName;
console.log(name);
```

### Variables
The `UpsertCompany` mutation requires an argument of type `UpsertCompanyVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCompanyVariables {
  name: string;
  type?: string | null;
  industry?: string | null;
  location?: string | null;
  coordinates?: unknown | null;
  employees?: string | null;
  founded?: number | null;
  website?: string | null;
  tagline?: string | null;
  about?: string | null;
  mission?: string | null;
  techStack?: string[] | null;
  departments?: string[] | null;
  hiringDomains?: string[] | null;
  benefits?: string[] | null;
  culture?: string[] | null;
  logo?: string | null;
  coverImage?: string | null;
}
```
### Return Type
Recall that executing the `UpsertCompany` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCompanyData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCompanyData {
  company_insert: Company_Key;
}
```
### Using `UpsertCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCompany, UpsertCompanyVariables } from '@skillsetu/dataconnect';

// The `UpsertCompany` mutation requires an argument of type `UpsertCompanyVariables`:
const upsertCompanyVars: UpsertCompanyVariables = {
  name: ..., 
  type: ..., // optional
  industry: ..., // optional
  location: ..., // optional
  coordinates: ..., // optional
  employees: ..., // optional
  founded: ..., // optional
  website: ..., // optional
  tagline: ..., // optional
  about: ..., // optional
  mission: ..., // optional
  techStack: ..., // optional
  departments: ..., // optional
  hiringDomains: ..., // optional
  benefits: ..., // optional
  culture: ..., // optional
  logo: ..., // optional
  coverImage: ..., // optional
};

// Call the `upsertCompany()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCompany(upsertCompanyVars);
// Variables can be defined inline as well.
const { data } = await upsertCompany({ name: ..., type: ..., industry: ..., location: ..., coordinates: ..., employees: ..., founded: ..., website: ..., tagline: ..., about: ..., mission: ..., techStack: ..., departments: ..., hiringDomains: ..., benefits: ..., culture: ..., logo: ..., coverImage: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCompany(dataConnect, upsertCompanyVars);

console.log(data.company_insert);

// Or, you can use the `Promise` API.
upsertCompany(upsertCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company_insert);
});
```

### Using `UpsertCompany`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCompanyRef, UpsertCompanyVariables } from '@skillsetu/dataconnect';

// The `UpsertCompany` mutation requires an argument of type `UpsertCompanyVariables`:
const upsertCompanyVars: UpsertCompanyVariables = {
  name: ..., 
  type: ..., // optional
  industry: ..., // optional
  location: ..., // optional
  coordinates: ..., // optional
  employees: ..., // optional
  founded: ..., // optional
  website: ..., // optional
  tagline: ..., // optional
  about: ..., // optional
  mission: ..., // optional
  techStack: ..., // optional
  departments: ..., // optional
  hiringDomains: ..., // optional
  benefits: ..., // optional
  culture: ..., // optional
  logo: ..., // optional
  coverImage: ..., // optional
};

// Call the `upsertCompanyRef()` function to get a reference to the mutation.
const ref = upsertCompanyRef(upsertCompanyVars);
// Variables can be defined inline as well.
const ref = upsertCompanyRef({ name: ..., type: ..., industry: ..., location: ..., coordinates: ..., employees: ..., founded: ..., website: ..., tagline: ..., about: ..., mission: ..., techStack: ..., departments: ..., hiringDomains: ..., benefits: ..., culture: ..., logo: ..., coverImage: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCompanyRef(dataConnect, upsertCompanyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.company_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.company_insert);
});
```

## UpdateMyCompany
You can execute the `UpdateMyCompany` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateMyCompany(vars: UpdateMyCompanyVariables): MutationPromise<UpdateMyCompanyData, UpdateMyCompanyVariables>;

interface UpdateMyCompanyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyCompanyVariables): MutationRef<UpdateMyCompanyData, UpdateMyCompanyVariables>;
}
export const updateMyCompanyRef: UpdateMyCompanyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMyCompany(dc: DataConnect, vars: UpdateMyCompanyVariables): MutationPromise<UpdateMyCompanyData, UpdateMyCompanyVariables>;

interface UpdateMyCompanyRef {
  ...
  (dc: DataConnect, vars: UpdateMyCompanyVariables): MutationRef<UpdateMyCompanyData, UpdateMyCompanyVariables>;
}
export const updateMyCompanyRef: UpdateMyCompanyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMyCompanyRef:
```typescript
const name = updateMyCompanyRef.operationName;
console.log(name);
```

### Variables
The `UpdateMyCompany` mutation requires an argument of type `UpdateMyCompanyVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMyCompanyVariables {
  id: UUIDString;
  name: string;
  industry?: string | null;
  employees?: string | null;
  location?: string | null;
  website?: string | null;
  about?: string | null;
  mission?: string | null;
}
```
### Return Type
Recall that executing the `UpdateMyCompany` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMyCompanyData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMyCompanyData {
  company_update?: Company_Key | null;
}
```
### Using `UpdateMyCompany`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMyCompany, UpdateMyCompanyVariables } from '@skillsetu/dataconnect';

// The `UpdateMyCompany` mutation requires an argument of type `UpdateMyCompanyVariables`:
const updateMyCompanyVars: UpdateMyCompanyVariables = {
  id: ..., 
  name: ..., 
  industry: ..., // optional
  employees: ..., // optional
  location: ..., // optional
  website: ..., // optional
  about: ..., // optional
  mission: ..., // optional
};

// Call the `updateMyCompany()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMyCompany(updateMyCompanyVars);
// Variables can be defined inline as well.
const { data } = await updateMyCompany({ id: ..., name: ..., industry: ..., employees: ..., location: ..., website: ..., about: ..., mission: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMyCompany(dataConnect, updateMyCompanyVars);

console.log(data.company_update);

// Or, you can use the `Promise` API.
updateMyCompany(updateMyCompanyVars).then((response) => {
  const data = response.data;
  console.log(data.company_update);
});
```

### Using `UpdateMyCompany`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMyCompanyRef, UpdateMyCompanyVariables } from '@skillsetu/dataconnect';

// The `UpdateMyCompany` mutation requires an argument of type `UpdateMyCompanyVariables`:
const updateMyCompanyVars: UpdateMyCompanyVariables = {
  id: ..., 
  name: ..., 
  industry: ..., // optional
  employees: ..., // optional
  location: ..., // optional
  website: ..., // optional
  about: ..., // optional
  mission: ..., // optional
};

// Call the `updateMyCompanyRef()` function to get a reference to the mutation.
const ref = updateMyCompanyRef(updateMyCompanyVars);
// Variables can be defined inline as well.
const ref = updateMyCompanyRef({ id: ..., name: ..., industry: ..., employees: ..., location: ..., website: ..., about: ..., mission: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMyCompanyRef(dataConnect, updateMyCompanyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.company_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.company_update);
});
```

## UpsertCollege
You can execute the `UpsertCollege` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertCollege(vars: UpsertCollegeVariables): MutationPromise<UpsertCollegeData, UpsertCollegeVariables>;

interface UpsertCollegeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCollegeVariables): MutationRef<UpsertCollegeData, UpsertCollegeVariables>;
}
export const upsertCollegeRef: UpsertCollegeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCollege(dc: DataConnect, vars: UpsertCollegeVariables): MutationPromise<UpsertCollegeData, UpsertCollegeVariables>;

interface UpsertCollegeRef {
  ...
  (dc: DataConnect, vars: UpsertCollegeVariables): MutationRef<UpsertCollegeData, UpsertCollegeVariables>;
}
export const upsertCollegeRef: UpsertCollegeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCollegeRef:
```typescript
const name = upsertCollegeRef.operationName;
console.log(name);
```

### Variables
The `UpsertCollege` mutation requires an argument of type `UpsertCollegeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCollegeVariables {
  name: string;
  location?: string | null;
  coordinates?: unknown | null;
  studentsCount?: number | null;
  verifiedStudentsCount?: number | null;
  placementReadiness?: number | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}
```
### Return Type
Recall that executing the `UpsertCollege` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCollegeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCollegeData {
  college_insert: College_Key;
}
```
### Using `UpsertCollege`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCollege, UpsertCollegeVariables } from '@skillsetu/dataconnect';

// The `UpsertCollege` mutation requires an argument of type `UpsertCollegeVariables`:
const upsertCollegeVars: UpsertCollegeVariables = {
  name: ..., 
  location: ..., // optional
  coordinates: ..., // optional
  studentsCount: ..., // optional
  verifiedStudentsCount: ..., // optional
  placementReadiness: ..., // optional
  contactPerson: ..., // optional
  contactEmail: ..., // optional
};

// Call the `upsertCollege()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCollege(upsertCollegeVars);
// Variables can be defined inline as well.
const { data } = await upsertCollege({ name: ..., location: ..., coordinates: ..., studentsCount: ..., verifiedStudentsCount: ..., placementReadiness: ..., contactPerson: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCollege(dataConnect, upsertCollegeVars);

console.log(data.college_insert);

// Or, you can use the `Promise` API.
upsertCollege(upsertCollegeVars).then((response) => {
  const data = response.data;
  console.log(data.college_insert);
});
```

### Using `UpsertCollege`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCollegeRef, UpsertCollegeVariables } from '@skillsetu/dataconnect';

// The `UpsertCollege` mutation requires an argument of type `UpsertCollegeVariables`:
const upsertCollegeVars: UpsertCollegeVariables = {
  name: ..., 
  location: ..., // optional
  coordinates: ..., // optional
  studentsCount: ..., // optional
  verifiedStudentsCount: ..., // optional
  placementReadiness: ..., // optional
  contactPerson: ..., // optional
  contactEmail: ..., // optional
};

// Call the `upsertCollegeRef()` function to get a reference to the mutation.
const ref = upsertCollegeRef(upsertCollegeVars);
// Variables can be defined inline as well.
const ref = upsertCollegeRef({ name: ..., location: ..., coordinates: ..., studentsCount: ..., verifiedStudentsCount: ..., placementReadiness: ..., contactPerson: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCollegeRef(dataConnect, upsertCollegeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.college_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.college_insert);
});
```

## CreateMyCollege
You can execute the `CreateMyCollege` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createMyCollege(vars: CreateMyCollegeVariables): MutationPromise<CreateMyCollegeData, CreateMyCollegeVariables>;

interface CreateMyCollegeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMyCollegeVariables): MutationRef<CreateMyCollegeData, CreateMyCollegeVariables>;
}
export const createMyCollegeRef: CreateMyCollegeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMyCollege(dc: DataConnect, vars: CreateMyCollegeVariables): MutationPromise<CreateMyCollegeData, CreateMyCollegeVariables>;

interface CreateMyCollegeRef {
  ...
  (dc: DataConnect, vars: CreateMyCollegeVariables): MutationRef<CreateMyCollegeData, CreateMyCollegeVariables>;
}
export const createMyCollegeRef: CreateMyCollegeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMyCollegeRef:
```typescript
const name = createMyCollegeRef.operationName;
console.log(name);
```

### Variables
The `CreateMyCollege` mutation requires an argument of type `CreateMyCollegeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMyCollegeVariables {
  name: string;
  location?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}
```
### Return Type
Recall that executing the `CreateMyCollege` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMyCollegeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMyCollegeData {
  college_insert: College_Key;
}
```
### Using `CreateMyCollege`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMyCollege, CreateMyCollegeVariables } from '@skillsetu/dataconnect';

// The `CreateMyCollege` mutation requires an argument of type `CreateMyCollegeVariables`:
const createMyCollegeVars: CreateMyCollegeVariables = {
  name: ..., 
  location: ..., // optional
  contactPerson: ..., // optional
  contactEmail: ..., // optional
};

// Call the `createMyCollege()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMyCollege(createMyCollegeVars);
// Variables can be defined inline as well.
const { data } = await createMyCollege({ name: ..., location: ..., contactPerson: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMyCollege(dataConnect, createMyCollegeVars);

console.log(data.college_insert);

// Or, you can use the `Promise` API.
createMyCollege(createMyCollegeVars).then((response) => {
  const data = response.data;
  console.log(data.college_insert);
});
```

### Using `CreateMyCollege`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMyCollegeRef, CreateMyCollegeVariables } from '@skillsetu/dataconnect';

// The `CreateMyCollege` mutation requires an argument of type `CreateMyCollegeVariables`:
const createMyCollegeVars: CreateMyCollegeVariables = {
  name: ..., 
  location: ..., // optional
  contactPerson: ..., // optional
  contactEmail: ..., // optional
};

// Call the `createMyCollegeRef()` function to get a reference to the mutation.
const ref = createMyCollegeRef(createMyCollegeVars);
// Variables can be defined inline as well.
const ref = createMyCollegeRef({ name: ..., location: ..., contactPerson: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMyCollegeRef(dataConnect, createMyCollegeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.college_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.college_insert);
});
```

## UpdateMyCollege
You can execute the `UpdateMyCollege` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateMyCollege(vars: UpdateMyCollegeVariables): MutationPromise<UpdateMyCollegeData, UpdateMyCollegeVariables>;

interface UpdateMyCollegeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyCollegeVariables): MutationRef<UpdateMyCollegeData, UpdateMyCollegeVariables>;
}
export const updateMyCollegeRef: UpdateMyCollegeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMyCollege(dc: DataConnect, vars: UpdateMyCollegeVariables): MutationPromise<UpdateMyCollegeData, UpdateMyCollegeVariables>;

interface UpdateMyCollegeRef {
  ...
  (dc: DataConnect, vars: UpdateMyCollegeVariables): MutationRef<UpdateMyCollegeData, UpdateMyCollegeVariables>;
}
export const updateMyCollegeRef: UpdateMyCollegeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMyCollegeRef:
```typescript
const name = updateMyCollegeRef.operationName;
console.log(name);
```

### Variables
The `UpdateMyCollege` mutation requires an argument of type `UpdateMyCollegeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMyCollegeVariables {
  id: UUIDString;
  name: string;
  location?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}
```
### Return Type
Recall that executing the `UpdateMyCollege` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMyCollegeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMyCollegeData {
  college_update?: College_Key | null;
}
```
### Using `UpdateMyCollege`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMyCollege, UpdateMyCollegeVariables } from '@skillsetu/dataconnect';

// The `UpdateMyCollege` mutation requires an argument of type `UpdateMyCollegeVariables`:
const updateMyCollegeVars: UpdateMyCollegeVariables = {
  id: ..., 
  name: ..., 
  location: ..., // optional
  contactPerson: ..., // optional
  contactEmail: ..., // optional
};

// Call the `updateMyCollege()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMyCollege(updateMyCollegeVars);
// Variables can be defined inline as well.
const { data } = await updateMyCollege({ id: ..., name: ..., location: ..., contactPerson: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMyCollege(dataConnect, updateMyCollegeVars);

console.log(data.college_update);

// Or, you can use the `Promise` API.
updateMyCollege(updateMyCollegeVars).then((response) => {
  const data = response.data;
  console.log(data.college_update);
});
```

### Using `UpdateMyCollege`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMyCollegeRef, UpdateMyCollegeVariables } from '@skillsetu/dataconnect';

// The `UpdateMyCollege` mutation requires an argument of type `UpdateMyCollegeVariables`:
const updateMyCollegeVars: UpdateMyCollegeVariables = {
  id: ..., 
  name: ..., 
  location: ..., // optional
  contactPerson: ..., // optional
  contactEmail: ..., // optional
};

// Call the `updateMyCollegeRef()` function to get a reference to the mutation.
const ref = updateMyCollegeRef(updateMyCollegeVars);
// Variables can be defined inline as well.
const ref = updateMyCollegeRef({ id: ..., name: ..., location: ..., contactPerson: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMyCollegeRef(dataConnect, updateMyCollegeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.college_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.college_update);
});
```

## CreateSkill
You can execute the `CreateSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSkill(vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface CreateSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
}
export const createSkillRef: CreateSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSkill(dc: DataConnect, vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface CreateSkillRef {
  ...
  (dc: DataConnect, vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
}
export const createSkillRef: CreateSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSkillRef:
```typescript
const name = createSkillRef.operationName;
console.log(name);
```

### Variables
The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSkillVariables {
  name: string;
  category?: string | null;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSkillData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSkillData {
  skill_insert: Skill_Key;
}
```
### Using `CreateSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSkill, CreateSkillVariables } from '@skillsetu/dataconnect';

// The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`:
const createSkillVars: CreateSkillVariables = {
  name: ..., 
  category: ..., // optional
  description: ..., // optional
};

// Call the `createSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSkill(createSkillVars);
// Variables can be defined inline as well.
const { data } = await createSkill({ name: ..., category: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSkill(dataConnect, createSkillVars);

console.log(data.skill_insert);

// Or, you can use the `Promise` API.
createSkill(createSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill_insert);
});
```

### Using `CreateSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSkillRef, CreateSkillVariables } from '@skillsetu/dataconnect';

// The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`:
const createSkillVars: CreateSkillVariables = {
  name: ..., 
  category: ..., // optional
  description: ..., // optional
};

// Call the `createSkillRef()` function to get a reference to the mutation.
const ref = createSkillRef(createSkillVars);
// Variables can be defined inline as well.
const ref = createSkillRef({ name: ..., category: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSkillRef(dataConnect, createSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skill_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skill_insert);
});
```

## UpsertUserSkill
You can execute the `UpsertUserSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUserSkill(vars: UpsertUserSkillVariables): MutationPromise<UpsertUserSkillData, UpsertUserSkillVariables>;

interface UpsertUserSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserSkillVariables): MutationRef<UpsertUserSkillData, UpsertUserSkillVariables>;
}
export const upsertUserSkillRef: UpsertUserSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserSkill(dc: DataConnect, vars: UpsertUserSkillVariables): MutationPromise<UpsertUserSkillData, UpsertUserSkillVariables>;

interface UpsertUserSkillRef {
  ...
  (dc: DataConnect, vars: UpsertUserSkillVariables): MutationRef<UpsertUserSkillData, UpsertUserSkillVariables>;
}
export const upsertUserSkillRef: UpsertUserSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserSkillRef:
```typescript
const name = upsertUserSkillRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserSkill` mutation requires an argument of type `UpsertUserSkillVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserSkillVariables {
  skillId: UUIDString;
  level: SkillLevel;
}
```
### Return Type
Recall that executing the `UpsertUserSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserSkillData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserSkillData {
  userSkill_upsert: UserSkill_Key;
}
```
### Using `UpsertUserSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserSkill, UpsertUserSkillVariables } from '@skillsetu/dataconnect';

// The `UpsertUserSkill` mutation requires an argument of type `UpsertUserSkillVariables`:
const upsertUserSkillVars: UpsertUserSkillVariables = {
  skillId: ..., 
  level: ..., 
};

// Call the `upsertUserSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserSkill(upsertUserSkillVars);
// Variables can be defined inline as well.
const { data } = await upsertUserSkill({ skillId: ..., level: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserSkill(dataConnect, upsertUserSkillVars);

console.log(data.userSkill_upsert);

// Or, you can use the `Promise` API.
upsertUserSkill(upsertUserSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkill_upsert);
});
```

### Using `UpsertUserSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserSkillRef, UpsertUserSkillVariables } from '@skillsetu/dataconnect';

// The `UpsertUserSkill` mutation requires an argument of type `UpsertUserSkillVariables`:
const upsertUserSkillVars: UpsertUserSkillVariables = {
  skillId: ..., 
  level: ..., 
};

// Call the `upsertUserSkillRef()` function to get a reference to the mutation.
const ref = upsertUserSkillRef(upsertUserSkillVars);
// Variables can be defined inline as well.
const ref = upsertUserSkillRef({ skillId: ..., level: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserSkillRef(dataConnect, upsertUserSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSkill_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkill_upsert);
});
```

## CreateCandidateProject
You can execute the `CreateCandidateProject` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCandidateProject(vars: CreateCandidateProjectVariables): MutationPromise<CreateCandidateProjectData, CreateCandidateProjectVariables>;

interface CreateCandidateProjectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCandidateProjectVariables): MutationRef<CreateCandidateProjectData, CreateCandidateProjectVariables>;
}
export const createCandidateProjectRef: CreateCandidateProjectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCandidateProject(dc: DataConnect, vars: CreateCandidateProjectVariables): MutationPromise<CreateCandidateProjectData, CreateCandidateProjectVariables>;

interface CreateCandidateProjectRef {
  ...
  (dc: DataConnect, vars: CreateCandidateProjectVariables): MutationRef<CreateCandidateProjectData, CreateCandidateProjectVariables>;
}
export const createCandidateProjectRef: CreateCandidateProjectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCandidateProjectRef:
```typescript
const name = createCandidateProjectRef.operationName;
console.log(name);
```

### Variables
The `CreateCandidateProject` mutation requires an argument of type `CreateCandidateProjectVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCandidateProjectVariables {
  title: string;
  description?: string | null;
  technologies?: string[] | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateCandidateProject` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCandidateProjectData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCandidateProjectData {
  candidateProject_insert: CandidateProject_Key;
}
```
### Using `CreateCandidateProject`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCandidateProject, CreateCandidateProjectVariables } from '@skillsetu/dataconnect';

// The `CreateCandidateProject` mutation requires an argument of type `CreateCandidateProjectVariables`:
const createCandidateProjectVars: CreateCandidateProjectVariables = {
  title: ..., 
  description: ..., // optional
  technologies: ..., // optional
  githubUrl: ..., // optional
  liveUrl: ..., // optional
};

// Call the `createCandidateProject()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCandidateProject(createCandidateProjectVars);
// Variables can be defined inline as well.
const { data } = await createCandidateProject({ title: ..., description: ..., technologies: ..., githubUrl: ..., liveUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCandidateProject(dataConnect, createCandidateProjectVars);

console.log(data.candidateProject_insert);

// Or, you can use the `Promise` API.
createCandidateProject(createCandidateProjectVars).then((response) => {
  const data = response.data;
  console.log(data.candidateProject_insert);
});
```

### Using `CreateCandidateProject`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCandidateProjectRef, CreateCandidateProjectVariables } from '@skillsetu/dataconnect';

// The `CreateCandidateProject` mutation requires an argument of type `CreateCandidateProjectVariables`:
const createCandidateProjectVars: CreateCandidateProjectVariables = {
  title: ..., 
  description: ..., // optional
  technologies: ..., // optional
  githubUrl: ..., // optional
  liveUrl: ..., // optional
};

// Call the `createCandidateProjectRef()` function to get a reference to the mutation.
const ref = createCandidateProjectRef(createCandidateProjectVars);
// Variables can be defined inline as well.
const ref = createCandidateProjectRef({ title: ..., description: ..., technologies: ..., githubUrl: ..., liveUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCandidateProjectRef(dataConnect, createCandidateProjectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.candidateProject_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.candidateProject_insert);
});
```

## CreateCandidateExperience
You can execute the `CreateCandidateExperience` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCandidateExperience(vars: CreateCandidateExperienceVariables): MutationPromise<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;

interface CreateCandidateExperienceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCandidateExperienceVariables): MutationRef<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
}
export const createCandidateExperienceRef: CreateCandidateExperienceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCandidateExperience(dc: DataConnect, vars: CreateCandidateExperienceVariables): MutationPromise<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;

interface CreateCandidateExperienceRef {
  ...
  (dc: DataConnect, vars: CreateCandidateExperienceVariables): MutationRef<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
}
export const createCandidateExperienceRef: CreateCandidateExperienceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCandidateExperienceRef:
```typescript
const name = createCandidateExperienceRef.operationName;
console.log(name);
```

### Variables
The `CreateCandidateExperience` mutation requires an argument of type `CreateCandidateExperienceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCandidateExperienceVariables {
  title: string;
  company: string;
  duration?: string | null;
  description?: string | null;
  location?: string | null;
  startDate?: TimestampString | null;
  endDate?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreateCandidateExperience` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCandidateExperienceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCandidateExperienceData {
  candidateExperience_insert: CandidateExperience_Key;
}
```
### Using `CreateCandidateExperience`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCandidateExperience, CreateCandidateExperienceVariables } from '@skillsetu/dataconnect';

// The `CreateCandidateExperience` mutation requires an argument of type `CreateCandidateExperienceVariables`:
const createCandidateExperienceVars: CreateCandidateExperienceVariables = {
  title: ..., 
  company: ..., 
  duration: ..., // optional
  description: ..., // optional
  location: ..., // optional
  startDate: ..., // optional
  endDate: ..., // optional
};

// Call the `createCandidateExperience()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCandidateExperience(createCandidateExperienceVars);
// Variables can be defined inline as well.
const { data } = await createCandidateExperience({ title: ..., company: ..., duration: ..., description: ..., location: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCandidateExperience(dataConnect, createCandidateExperienceVars);

console.log(data.candidateExperience_insert);

// Or, you can use the `Promise` API.
createCandidateExperience(createCandidateExperienceVars).then((response) => {
  const data = response.data;
  console.log(data.candidateExperience_insert);
});
```

### Using `CreateCandidateExperience`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCandidateExperienceRef, CreateCandidateExperienceVariables } from '@skillsetu/dataconnect';

// The `CreateCandidateExperience` mutation requires an argument of type `CreateCandidateExperienceVariables`:
const createCandidateExperienceVars: CreateCandidateExperienceVariables = {
  title: ..., 
  company: ..., 
  duration: ..., // optional
  description: ..., // optional
  location: ..., // optional
  startDate: ..., // optional
  endDate: ..., // optional
};

// Call the `createCandidateExperienceRef()` function to get a reference to the mutation.
const ref = createCandidateExperienceRef(createCandidateExperienceVars);
// Variables can be defined inline as well.
const ref = createCandidateExperienceRef({ title: ..., company: ..., duration: ..., description: ..., location: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCandidateExperienceRef(dataConnect, createCandidateExperienceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.candidateExperience_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.candidateExperience_insert);
});
```

## CreateCandidateEducation
You can execute the `CreateCandidateEducation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCandidateEducation(vars: CreateCandidateEducationVariables): MutationPromise<CreateCandidateEducationData, CreateCandidateEducationVariables>;

interface CreateCandidateEducationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCandidateEducationVariables): MutationRef<CreateCandidateEducationData, CreateCandidateEducationVariables>;
}
export const createCandidateEducationRef: CreateCandidateEducationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCandidateEducation(dc: DataConnect, vars: CreateCandidateEducationVariables): MutationPromise<CreateCandidateEducationData, CreateCandidateEducationVariables>;

interface CreateCandidateEducationRef {
  ...
  (dc: DataConnect, vars: CreateCandidateEducationVariables): MutationRef<CreateCandidateEducationData, CreateCandidateEducationVariables>;
}
export const createCandidateEducationRef: CreateCandidateEducationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCandidateEducationRef:
```typescript
const name = createCandidateEducationRef.operationName;
console.log(name);
```

### Variables
The `CreateCandidateEducation` mutation requires an argument of type `CreateCandidateEducationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCandidateEducationVariables {
  degree: string;
  department: string;
  college: string;
  graduationYear?: number | null;
  cgpa?: number | null;
  currentYear?: string | null;
}
```
### Return Type
Recall that executing the `CreateCandidateEducation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCandidateEducationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCandidateEducationData {
  candidateEducation_insert: CandidateEducation_Key;
}
```
### Using `CreateCandidateEducation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCandidateEducation, CreateCandidateEducationVariables } from '@skillsetu/dataconnect';

// The `CreateCandidateEducation` mutation requires an argument of type `CreateCandidateEducationVariables`:
const createCandidateEducationVars: CreateCandidateEducationVariables = {
  degree: ..., 
  department: ..., 
  college: ..., 
  graduationYear: ..., // optional
  cgpa: ..., // optional
  currentYear: ..., // optional
};

// Call the `createCandidateEducation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCandidateEducation(createCandidateEducationVars);
// Variables can be defined inline as well.
const { data } = await createCandidateEducation({ degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCandidateEducation(dataConnect, createCandidateEducationVars);

console.log(data.candidateEducation_insert);

// Or, you can use the `Promise` API.
createCandidateEducation(createCandidateEducationVars).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_insert);
});
```

### Using `CreateCandidateEducation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCandidateEducationRef, CreateCandidateEducationVariables } from '@skillsetu/dataconnect';

// The `CreateCandidateEducation` mutation requires an argument of type `CreateCandidateEducationVariables`:
const createCandidateEducationVars: CreateCandidateEducationVariables = {
  degree: ..., 
  department: ..., 
  college: ..., 
  graduationYear: ..., // optional
  cgpa: ..., // optional
  currentYear: ..., // optional
};

// Call the `createCandidateEducationRef()` function to get a reference to the mutation.
const ref = createCandidateEducationRef(createCandidateEducationVars);
// Variables can be defined inline as well.
const ref = createCandidateEducationRef({ degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCandidateEducationRef(dataConnect, createCandidateEducationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.candidateEducation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_insert);
});
```

## CreateProfileEducation
You can execute the `CreateProfileEducation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createProfileEducation(vars: CreateProfileEducationVariables): MutationPromise<CreateProfileEducationData, CreateProfileEducationVariables>;

interface CreateProfileEducationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProfileEducationVariables): MutationRef<CreateProfileEducationData, CreateProfileEducationVariables>;
}
export const createProfileEducationRef: CreateProfileEducationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProfileEducation(dc: DataConnect, vars: CreateProfileEducationVariables): MutationPromise<CreateProfileEducationData, CreateProfileEducationVariables>;

interface CreateProfileEducationRef {
  ...
  (dc: DataConnect, vars: CreateProfileEducationVariables): MutationRef<CreateProfileEducationData, CreateProfileEducationVariables>;
}
export const createProfileEducationRef: CreateProfileEducationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProfileEducationRef:
```typescript
const name = createProfileEducationRef.operationName;
console.log(name);
```

### Variables
The `CreateProfileEducation` mutation requires an argument of type `CreateProfileEducationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProfileEducationVariables {
  degree: string;
  department: string;
  college: string;
  graduationYear?: number | null;
  cgpa?: number | null;
  currentYear?: string | null;
}
```
### Return Type
Recall that executing the `CreateProfileEducation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProfileEducationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProfileEducationData {
  candidateEducation_insert: CandidateEducation_Key;
}
```
### Using `CreateProfileEducation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProfileEducation, CreateProfileEducationVariables } from '@skillsetu/dataconnect';

// The `CreateProfileEducation` mutation requires an argument of type `CreateProfileEducationVariables`:
const createProfileEducationVars: CreateProfileEducationVariables = {
  degree: ..., 
  department: ..., 
  college: ..., 
  graduationYear: ..., // optional
  cgpa: ..., // optional
  currentYear: ..., // optional
};

// Call the `createProfileEducation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProfileEducation(createProfileEducationVars);
// Variables can be defined inline as well.
const { data } = await createProfileEducation({ degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProfileEducation(dataConnect, createProfileEducationVars);

console.log(data.candidateEducation_insert);

// Or, you can use the `Promise` API.
createProfileEducation(createProfileEducationVars).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_insert);
});
```

### Using `CreateProfileEducation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProfileEducationRef, CreateProfileEducationVariables } from '@skillsetu/dataconnect';

// The `CreateProfileEducation` mutation requires an argument of type `CreateProfileEducationVariables`:
const createProfileEducationVars: CreateProfileEducationVariables = {
  degree: ..., 
  department: ..., 
  college: ..., 
  graduationYear: ..., // optional
  cgpa: ..., // optional
  currentYear: ..., // optional
};

// Call the `createProfileEducationRef()` function to get a reference to the mutation.
const ref = createProfileEducationRef(createProfileEducationVars);
// Variables can be defined inline as well.
const ref = createProfileEducationRef({ degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProfileEducationRef(dataConnect, createProfileEducationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.candidateEducation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_insert);
});
```

## UpdateMyProfileEducation
You can execute the `UpdateMyProfileEducation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateMyProfileEducation(vars: UpdateMyProfileEducationVariables): MutationPromise<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;

interface UpdateMyProfileEducationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyProfileEducationVariables): MutationRef<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
}
export const updateMyProfileEducationRef: UpdateMyProfileEducationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMyProfileEducation(dc: DataConnect, vars: UpdateMyProfileEducationVariables): MutationPromise<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;

interface UpdateMyProfileEducationRef {
  ...
  (dc: DataConnect, vars: UpdateMyProfileEducationVariables): MutationRef<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
}
export const updateMyProfileEducationRef: UpdateMyProfileEducationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMyProfileEducationRef:
```typescript
const name = updateMyProfileEducationRef.operationName;
console.log(name);
```

### Variables
The `UpdateMyProfileEducation` mutation requires an argument of type `UpdateMyProfileEducationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMyProfileEducationVariables {
  id: UUIDString;
  degree: string;
  department: string;
  college: string;
  graduationYear?: number | null;
  cgpa?: number | null;
  currentYear?: string | null;
}
```
### Return Type
Recall that executing the `UpdateMyProfileEducation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMyProfileEducationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMyProfileEducationData {
  candidateEducation_update?: CandidateEducation_Key | null;
}
```
### Using `UpdateMyProfileEducation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMyProfileEducation, UpdateMyProfileEducationVariables } from '@skillsetu/dataconnect';

// The `UpdateMyProfileEducation` mutation requires an argument of type `UpdateMyProfileEducationVariables`:
const updateMyProfileEducationVars: UpdateMyProfileEducationVariables = {
  id: ..., 
  degree: ..., 
  department: ..., 
  college: ..., 
  graduationYear: ..., // optional
  cgpa: ..., // optional
  currentYear: ..., // optional
};

// Call the `updateMyProfileEducation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMyProfileEducation(updateMyProfileEducationVars);
// Variables can be defined inline as well.
const { data } = await updateMyProfileEducation({ id: ..., degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMyProfileEducation(dataConnect, updateMyProfileEducationVars);

console.log(data.candidateEducation_update);

// Or, you can use the `Promise` API.
updateMyProfileEducation(updateMyProfileEducationVars).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_update);
});
```

### Using `UpdateMyProfileEducation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMyProfileEducationRef, UpdateMyProfileEducationVariables } from '@skillsetu/dataconnect';

// The `UpdateMyProfileEducation` mutation requires an argument of type `UpdateMyProfileEducationVariables`:
const updateMyProfileEducationVars: UpdateMyProfileEducationVariables = {
  id: ..., 
  degree: ..., 
  department: ..., 
  college: ..., 
  graduationYear: ..., // optional
  cgpa: ..., // optional
  currentYear: ..., // optional
};

// Call the `updateMyProfileEducationRef()` function to get a reference to the mutation.
const ref = updateMyProfileEducationRef(updateMyProfileEducationVars);
// Variables can be defined inline as well.
const ref = updateMyProfileEducationRef({ id: ..., degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMyProfileEducationRef(dataConnect, updateMyProfileEducationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.candidateEducation_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_update);
});
```

## DeleteMyDuplicateEducation
You can execute the `DeleteMyDuplicateEducation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteMyDuplicateEducation(vars: DeleteMyDuplicateEducationVariables): MutationPromise<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;

interface DeleteMyDuplicateEducationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMyDuplicateEducationVariables): MutationRef<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
}
export const deleteMyDuplicateEducationRef: DeleteMyDuplicateEducationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteMyDuplicateEducation(dc: DataConnect, vars: DeleteMyDuplicateEducationVariables): MutationPromise<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;

interface DeleteMyDuplicateEducationRef {
  ...
  (dc: DataConnect, vars: DeleteMyDuplicateEducationVariables): MutationRef<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
}
export const deleteMyDuplicateEducationRef: DeleteMyDuplicateEducationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteMyDuplicateEducationRef:
```typescript
const name = deleteMyDuplicateEducationRef.operationName;
console.log(name);
```

### Variables
The `DeleteMyDuplicateEducation` mutation requires an argument of type `DeleteMyDuplicateEducationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteMyDuplicateEducationVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteMyDuplicateEducation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMyDuplicateEducationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteMyDuplicateEducationData {
  candidateEducation_delete?: CandidateEducation_Key | null;
}
```
### Using `DeleteMyDuplicateEducation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMyDuplicateEducation, DeleteMyDuplicateEducationVariables } from '@skillsetu/dataconnect';

// The `DeleteMyDuplicateEducation` mutation requires an argument of type `DeleteMyDuplicateEducationVariables`:
const deleteMyDuplicateEducationVars: DeleteMyDuplicateEducationVariables = {
  id: ..., 
};

// Call the `deleteMyDuplicateEducation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMyDuplicateEducation(deleteMyDuplicateEducationVars);
// Variables can be defined inline as well.
const { data } = await deleteMyDuplicateEducation({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMyDuplicateEducation(dataConnect, deleteMyDuplicateEducationVars);

console.log(data.candidateEducation_delete);

// Or, you can use the `Promise` API.
deleteMyDuplicateEducation(deleteMyDuplicateEducationVars).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_delete);
});
```

### Using `DeleteMyDuplicateEducation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMyDuplicateEducationRef, DeleteMyDuplicateEducationVariables } from '@skillsetu/dataconnect';

// The `DeleteMyDuplicateEducation` mutation requires an argument of type `DeleteMyDuplicateEducationVariables`:
const deleteMyDuplicateEducationVars: DeleteMyDuplicateEducationVariables = {
  id: ..., 
};

// Call the `deleteMyDuplicateEducationRef()` function to get a reference to the mutation.
const ref = deleteMyDuplicateEducationRef(deleteMyDuplicateEducationVars);
// Variables can be defined inline as well.
const ref = deleteMyDuplicateEducationRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMyDuplicateEducationRef(dataConnect, deleteMyDuplicateEducationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.candidateEducation_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.candidateEducation_delete);
});
```

## CreateJob
You can execute the `CreateJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createJob(vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;

interface CreateJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
}
export const createJobRef: CreateJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createJob(dc: DataConnect, vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;

interface CreateJobRef {
  ...
  (dc: DataConnect, vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
}
export const createJobRef: CreateJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createJobRef:
```typescript
const name = createJobRef.operationName;
console.log(name);
```

### Variables
The `CreateJob` mutation requires an argument of type `CreateJobVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateJobVariables {
  companyId: UUIDString;
  title: string;
  department?: string | null;
  location?: string | null;
  workMode?: string | null;
  jobType?: string | null;
  salaryRange?: string | null;
  experienceRequired?: string | null;
  education?: string | null;
  graduationYear?: string | null;
  minimumCgpa?: number | null;
  description?: string | null;
  responsibilities?: string[] | null;
  qualifications?: string[] | null;
  deadline?: TimestampString | null;
  openings?: number | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `CreateJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateJobData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateJobData {
  job_insert: Job_Key;
}
```
### Using `CreateJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createJob, CreateJobVariables } from '@skillsetu/dataconnect';

// The `CreateJob` mutation requires an argument of type `CreateJobVariables`:
const createJobVars: CreateJobVariables = {
  companyId: ..., 
  title: ..., 
  department: ..., // optional
  location: ..., // optional
  workMode: ..., // optional
  jobType: ..., // optional
  salaryRange: ..., // optional
  experienceRequired: ..., // optional
  education: ..., // optional
  graduationYear: ..., // optional
  minimumCgpa: ..., // optional
  description: ..., // optional
  responsibilities: ..., // optional
  qualifications: ..., // optional
  deadline: ..., // optional
  openings: ..., // optional
  status: ..., // optional
};

// Call the `createJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createJob(createJobVars);
// Variables can be defined inline as well.
const { data } = await createJob({ companyId: ..., title: ..., department: ..., location: ..., workMode: ..., jobType: ..., salaryRange: ..., experienceRequired: ..., education: ..., graduationYear: ..., minimumCgpa: ..., description: ..., responsibilities: ..., qualifications: ..., deadline: ..., openings: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createJob(dataConnect, createJobVars);

console.log(data.job_insert);

// Or, you can use the `Promise` API.
createJob(createJobVars).then((response) => {
  const data = response.data;
  console.log(data.job_insert);
});
```

### Using `CreateJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createJobRef, CreateJobVariables } from '@skillsetu/dataconnect';

// The `CreateJob` mutation requires an argument of type `CreateJobVariables`:
const createJobVars: CreateJobVariables = {
  companyId: ..., 
  title: ..., 
  department: ..., // optional
  location: ..., // optional
  workMode: ..., // optional
  jobType: ..., // optional
  salaryRange: ..., // optional
  experienceRequired: ..., // optional
  education: ..., // optional
  graduationYear: ..., // optional
  minimumCgpa: ..., // optional
  description: ..., // optional
  responsibilities: ..., // optional
  qualifications: ..., // optional
  deadline: ..., // optional
  openings: ..., // optional
  status: ..., // optional
};

// Call the `createJobRef()` function to get a reference to the mutation.
const ref = createJobRef(createJobVars);
// Variables can be defined inline as well.
const ref = createJobRef({ companyId: ..., title: ..., department: ..., location: ..., workMode: ..., jobType: ..., salaryRange: ..., experienceRequired: ..., education: ..., graduationYear: ..., minimumCgpa: ..., description: ..., responsibilities: ..., qualifications: ..., deadline: ..., openings: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createJobRef(dataConnect, createJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_insert);
});
```

## UpsertJobRequiredSkill
You can execute the `UpsertJobRequiredSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertJobRequiredSkill(vars: UpsertJobRequiredSkillVariables): MutationPromise<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;

interface UpsertJobRequiredSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertJobRequiredSkillVariables): MutationRef<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
}
export const upsertJobRequiredSkillRef: UpsertJobRequiredSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertJobRequiredSkill(dc: DataConnect, vars: UpsertJobRequiredSkillVariables): MutationPromise<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;

interface UpsertJobRequiredSkillRef {
  ...
  (dc: DataConnect, vars: UpsertJobRequiredSkillVariables): MutationRef<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
}
export const upsertJobRequiredSkillRef: UpsertJobRequiredSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertJobRequiredSkillRef:
```typescript
const name = upsertJobRequiredSkillRef.operationName;
console.log(name);
```

### Variables
The `UpsertJobRequiredSkill` mutation requires an argument of type `UpsertJobRequiredSkillVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertJobRequiredSkillVariables {
  jobId: UUIDString;
  skillId: UUIDString;
  level: SkillLevel;
  importance: SkillImportance;
  minScore?: number | null;
}
```
### Return Type
Recall that executing the `UpsertJobRequiredSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertJobRequiredSkillData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertJobRequiredSkillData {
  jobRequiredSkill_upsert: JobRequiredSkill_Key;
}
```
### Using `UpsertJobRequiredSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertJobRequiredSkill, UpsertJobRequiredSkillVariables } from '@skillsetu/dataconnect';

// The `UpsertJobRequiredSkill` mutation requires an argument of type `UpsertJobRequiredSkillVariables`:
const upsertJobRequiredSkillVars: UpsertJobRequiredSkillVariables = {
  jobId: ..., 
  skillId: ..., 
  level: ..., 
  importance: ..., 
  minScore: ..., // optional
};

// Call the `upsertJobRequiredSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertJobRequiredSkill(upsertJobRequiredSkillVars);
// Variables can be defined inline as well.
const { data } = await upsertJobRequiredSkill({ jobId: ..., skillId: ..., level: ..., importance: ..., minScore: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertJobRequiredSkill(dataConnect, upsertJobRequiredSkillVars);

console.log(data.jobRequiredSkill_upsert);

// Or, you can use the `Promise` API.
upsertJobRequiredSkill(upsertJobRequiredSkillVars).then((response) => {
  const data = response.data;
  console.log(data.jobRequiredSkill_upsert);
});
```

### Using `UpsertJobRequiredSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertJobRequiredSkillRef, UpsertJobRequiredSkillVariables } from '@skillsetu/dataconnect';

// The `UpsertJobRequiredSkill` mutation requires an argument of type `UpsertJobRequiredSkillVariables`:
const upsertJobRequiredSkillVars: UpsertJobRequiredSkillVariables = {
  jobId: ..., 
  skillId: ..., 
  level: ..., 
  importance: ..., 
  minScore: ..., // optional
};

// Call the `upsertJobRequiredSkillRef()` function to get a reference to the mutation.
const ref = upsertJobRequiredSkillRef(upsertJobRequiredSkillVars);
// Variables can be defined inline as well.
const ref = upsertJobRequiredSkillRef({ jobId: ..., skillId: ..., level: ..., importance: ..., minScore: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertJobRequiredSkillRef(dataConnect, upsertJobRequiredSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.jobRequiredSkill_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.jobRequiredSkill_upsert);
});
```

## CreateInternship
You can execute the `CreateInternship` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createInternship(vars: CreateInternshipVariables): MutationPromise<CreateInternshipData, CreateInternshipVariables>;

interface CreateInternshipRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInternshipVariables): MutationRef<CreateInternshipData, CreateInternshipVariables>;
}
export const createInternshipRef: CreateInternshipRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createInternship(dc: DataConnect, vars: CreateInternshipVariables): MutationPromise<CreateInternshipData, CreateInternshipVariables>;

interface CreateInternshipRef {
  ...
  (dc: DataConnect, vars: CreateInternshipVariables): MutationRef<CreateInternshipData, CreateInternshipVariables>;
}
export const createInternshipRef: CreateInternshipRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createInternshipRef:
```typescript
const name = createInternshipRef.operationName;
console.log(name);
```

### Variables
The `CreateInternship` mutation requires an argument of type `CreateInternshipVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateInternshipVariables {
  companyId: UUIDString;
  title: string;
  department?: string | null;
  location?: string | null;
  workMode?: string | null;
  duration?: string | null;
  stipend?: string | null;
  eligibility?: string | null;
  startDate?: TimestampString | null;
  applicationDeadline?: TimestampString | null;
  description?: string | null;
  learningOutcomes?: string[] | null;
  mentor?: string | null;
  openings?: number | null;
  isStartupFriendly?: boolean | null;
  targetAudience?: string | null;
  eligibleForConversion?: boolean | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `CreateInternship` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInternshipData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInternshipData {
  internship_insert: Internship_Key;
}
```
### Using `CreateInternship`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInternship, CreateInternshipVariables } from '@skillsetu/dataconnect';

// The `CreateInternship` mutation requires an argument of type `CreateInternshipVariables`:
const createInternshipVars: CreateInternshipVariables = {
  companyId: ..., 
  title: ..., 
  department: ..., // optional
  location: ..., // optional
  workMode: ..., // optional
  duration: ..., // optional
  stipend: ..., // optional
  eligibility: ..., // optional
  startDate: ..., // optional
  applicationDeadline: ..., // optional
  description: ..., // optional
  learningOutcomes: ..., // optional
  mentor: ..., // optional
  openings: ..., // optional
  isStartupFriendly: ..., // optional
  targetAudience: ..., // optional
  eligibleForConversion: ..., // optional
  status: ..., // optional
};

// Call the `createInternship()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInternship(createInternshipVars);
// Variables can be defined inline as well.
const { data } = await createInternship({ companyId: ..., title: ..., department: ..., location: ..., workMode: ..., duration: ..., stipend: ..., eligibility: ..., startDate: ..., applicationDeadline: ..., description: ..., learningOutcomes: ..., mentor: ..., openings: ..., isStartupFriendly: ..., targetAudience: ..., eligibleForConversion: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInternship(dataConnect, createInternshipVars);

console.log(data.internship_insert);

// Or, you can use the `Promise` API.
createInternship(createInternshipVars).then((response) => {
  const data = response.data;
  console.log(data.internship_insert);
});
```

### Using `CreateInternship`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInternshipRef, CreateInternshipVariables } from '@skillsetu/dataconnect';

// The `CreateInternship` mutation requires an argument of type `CreateInternshipVariables`:
const createInternshipVars: CreateInternshipVariables = {
  companyId: ..., 
  title: ..., 
  department: ..., // optional
  location: ..., // optional
  workMode: ..., // optional
  duration: ..., // optional
  stipend: ..., // optional
  eligibility: ..., // optional
  startDate: ..., // optional
  applicationDeadline: ..., // optional
  description: ..., // optional
  learningOutcomes: ..., // optional
  mentor: ..., // optional
  openings: ..., // optional
  isStartupFriendly: ..., // optional
  targetAudience: ..., // optional
  eligibleForConversion: ..., // optional
  status: ..., // optional
};

// Call the `createInternshipRef()` function to get a reference to the mutation.
const ref = createInternshipRef(createInternshipVars);
// Variables can be defined inline as well.
const ref = createInternshipRef({ companyId: ..., title: ..., department: ..., location: ..., workMode: ..., duration: ..., stipend: ..., eligibility: ..., startDate: ..., applicationDeadline: ..., description: ..., learningOutcomes: ..., mentor: ..., openings: ..., isStartupFriendly: ..., targetAudience: ..., eligibleForConversion: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInternshipRef(dataConnect, createInternshipVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.internship_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.internship_insert);
});
```

## UpsertInternshipRequiredSkill
You can execute the `UpsertInternshipRequiredSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertInternshipRequiredSkill(vars: UpsertInternshipRequiredSkillVariables): MutationPromise<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;

interface UpsertInternshipRequiredSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertInternshipRequiredSkillVariables): MutationRef<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
}
export const upsertInternshipRequiredSkillRef: UpsertInternshipRequiredSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertInternshipRequiredSkill(dc: DataConnect, vars: UpsertInternshipRequiredSkillVariables): MutationPromise<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;

interface UpsertInternshipRequiredSkillRef {
  ...
  (dc: DataConnect, vars: UpsertInternshipRequiredSkillVariables): MutationRef<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
}
export const upsertInternshipRequiredSkillRef: UpsertInternshipRequiredSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertInternshipRequiredSkillRef:
```typescript
const name = upsertInternshipRequiredSkillRef.operationName;
console.log(name);
```

### Variables
The `UpsertInternshipRequiredSkill` mutation requires an argument of type `UpsertInternshipRequiredSkillVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertInternshipRequiredSkillVariables {
  internshipId: UUIDString;
  skillId: UUIDString;
  level: SkillLevel;
  importance: SkillImportance;
  minScore?: number | null;
}
```
### Return Type
Recall that executing the `UpsertInternshipRequiredSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertInternshipRequiredSkillData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertInternshipRequiredSkillData {
  internshipRequiredSkill_upsert: InternshipRequiredSkill_Key;
}
```
### Using `UpsertInternshipRequiredSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertInternshipRequiredSkill, UpsertInternshipRequiredSkillVariables } from '@skillsetu/dataconnect';

// The `UpsertInternshipRequiredSkill` mutation requires an argument of type `UpsertInternshipRequiredSkillVariables`:
const upsertInternshipRequiredSkillVars: UpsertInternshipRequiredSkillVariables = {
  internshipId: ..., 
  skillId: ..., 
  level: ..., 
  importance: ..., 
  minScore: ..., // optional
};

// Call the `upsertInternshipRequiredSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertInternshipRequiredSkill(upsertInternshipRequiredSkillVars);
// Variables can be defined inline as well.
const { data } = await upsertInternshipRequiredSkill({ internshipId: ..., skillId: ..., level: ..., importance: ..., minScore: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertInternshipRequiredSkill(dataConnect, upsertInternshipRequiredSkillVars);

console.log(data.internshipRequiredSkill_upsert);

// Or, you can use the `Promise` API.
upsertInternshipRequiredSkill(upsertInternshipRequiredSkillVars).then((response) => {
  const data = response.data;
  console.log(data.internshipRequiredSkill_upsert);
});
```

### Using `UpsertInternshipRequiredSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertInternshipRequiredSkillRef, UpsertInternshipRequiredSkillVariables } from '@skillsetu/dataconnect';

// The `UpsertInternshipRequiredSkill` mutation requires an argument of type `UpsertInternshipRequiredSkillVariables`:
const upsertInternshipRequiredSkillVars: UpsertInternshipRequiredSkillVariables = {
  internshipId: ..., 
  skillId: ..., 
  level: ..., 
  importance: ..., 
  minScore: ..., // optional
};

// Call the `upsertInternshipRequiredSkillRef()` function to get a reference to the mutation.
const ref = upsertInternshipRequiredSkillRef(upsertInternshipRequiredSkillVars);
// Variables can be defined inline as well.
const ref = upsertInternshipRequiredSkillRef({ internshipId: ..., skillId: ..., level: ..., importance: ..., minScore: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertInternshipRequiredSkillRef(dataConnect, upsertInternshipRequiredSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.internshipRequiredSkill_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.internshipRequiredSkill_upsert);
});
```

## CreateApplication
You can execute the `CreateApplication` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createApplication(vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;

interface CreateApplicationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
}
export const createApplicationRef: CreateApplicationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createApplication(dc: DataConnect, vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;

interface CreateApplicationRef {
  ...
  (dc: DataConnect, vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
}
export const createApplicationRef: CreateApplicationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createApplicationRef:
```typescript
const name = createApplicationRef.operationName;
console.log(name);
```

### Variables
The `CreateApplication` mutation requires an argument of type `CreateApplicationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateApplicationVariables {
  companyId: UUIDString;
  opportunityId: UUIDString;
  opportunityType: string;
  jobId?: string | null;
  internshipId?: string | null;
  opportunityKey?: string | null;
  title: string;
  jobType: string;
  matchScore?: number | null;
  matchedSkills?: string[] | null;
  missingSkills?: string[] | null;
}
```
### Return Type
Recall that executing the `CreateApplication` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateApplicationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateApplicationData {
  application_insert: Application_Key;
}
```
### Using `CreateApplication`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createApplication, CreateApplicationVariables } from '@skillsetu/dataconnect';

// The `CreateApplication` mutation requires an argument of type `CreateApplicationVariables`:
const createApplicationVars: CreateApplicationVariables = {
  companyId: ..., 
  opportunityId: ..., 
  opportunityType: ..., 
  jobId: ..., // optional
  internshipId: ..., // optional
  opportunityKey: ..., // optional
  title: ..., 
  jobType: ..., 
  matchScore: ..., // optional
  matchedSkills: ..., // optional
  missingSkills: ..., // optional
};

// Call the `createApplication()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createApplication(createApplicationVars);
// Variables can be defined inline as well.
const { data } = await createApplication({ companyId: ..., opportunityId: ..., opportunityType: ..., jobId: ..., internshipId: ..., opportunityKey: ..., title: ..., jobType: ..., matchScore: ..., matchedSkills: ..., missingSkills: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createApplication(dataConnect, createApplicationVars);

console.log(data.application_insert);

// Or, you can use the `Promise` API.
createApplication(createApplicationVars).then((response) => {
  const data = response.data;
  console.log(data.application_insert);
});
```

### Using `CreateApplication`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createApplicationRef, CreateApplicationVariables } from '@skillsetu/dataconnect';

// The `CreateApplication` mutation requires an argument of type `CreateApplicationVariables`:
const createApplicationVars: CreateApplicationVariables = {
  companyId: ..., 
  opportunityId: ..., 
  opportunityType: ..., 
  jobId: ..., // optional
  internshipId: ..., // optional
  opportunityKey: ..., // optional
  title: ..., 
  jobType: ..., 
  matchScore: ..., // optional
  matchedSkills: ..., // optional
  missingSkills: ..., // optional
};

// Call the `createApplicationRef()` function to get a reference to the mutation.
const ref = createApplicationRef(createApplicationVars);
// Variables can be defined inline as well.
const ref = createApplicationRef({ companyId: ..., opportunityId: ..., opportunityType: ..., jobId: ..., internshipId: ..., opportunityKey: ..., title: ..., jobType: ..., matchScore: ..., matchedSkills: ..., missingSkills: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createApplicationRef(dataConnect, createApplicationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.application_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.application_insert);
});
```

## UpdateApplicationStage
You can execute the `UpdateApplicationStage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateApplicationStage(vars: UpdateApplicationStageVariables): MutationPromise<UpdateApplicationStageData, UpdateApplicationStageVariables>;

interface UpdateApplicationStageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateApplicationStageVariables): MutationRef<UpdateApplicationStageData, UpdateApplicationStageVariables>;
}
export const updateApplicationStageRef: UpdateApplicationStageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateApplicationStage(dc: DataConnect, vars: UpdateApplicationStageVariables): MutationPromise<UpdateApplicationStageData, UpdateApplicationStageVariables>;

interface UpdateApplicationStageRef {
  ...
  (dc: DataConnect, vars: UpdateApplicationStageVariables): MutationRef<UpdateApplicationStageData, UpdateApplicationStageVariables>;
}
export const updateApplicationStageRef: UpdateApplicationStageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateApplicationStageRef:
```typescript
const name = updateApplicationStageRef.operationName;
console.log(name);
```

### Variables
The `UpdateApplicationStage` mutation requires an argument of type `UpdateApplicationStageVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateApplicationStageVariables {
  id: UUIDString;
  stage: ApplicationStage;
  note?: string | null;
}
```
### Return Type
Recall that executing the `UpdateApplicationStage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateApplicationStageData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateApplicationStageData {
  application_update?: Application_Key | null;
}
```
### Using `UpdateApplicationStage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateApplicationStage, UpdateApplicationStageVariables } from '@skillsetu/dataconnect';

// The `UpdateApplicationStage` mutation requires an argument of type `UpdateApplicationStageVariables`:
const updateApplicationStageVars: UpdateApplicationStageVariables = {
  id: ..., 
  stage: ..., 
  note: ..., // optional
};

// Call the `updateApplicationStage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateApplicationStage(updateApplicationStageVars);
// Variables can be defined inline as well.
const { data } = await updateApplicationStage({ id: ..., stage: ..., note: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateApplicationStage(dataConnect, updateApplicationStageVars);

console.log(data.application_update);

// Or, you can use the `Promise` API.
updateApplicationStage(updateApplicationStageVars).then((response) => {
  const data = response.data;
  console.log(data.application_update);
});
```

### Using `UpdateApplicationStage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateApplicationStageRef, UpdateApplicationStageVariables } from '@skillsetu/dataconnect';

// The `UpdateApplicationStage` mutation requires an argument of type `UpdateApplicationStageVariables`:
const updateApplicationStageVars: UpdateApplicationStageVariables = {
  id: ..., 
  stage: ..., 
  note: ..., // optional
};

// Call the `updateApplicationStageRef()` function to get a reference to the mutation.
const ref = updateApplicationStageRef(updateApplicationStageVars);
// Variables can be defined inline as well.
const ref = updateApplicationStageRef({ id: ..., stage: ..., note: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateApplicationStageRef(dataConnect, updateApplicationStageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.application_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.application_update);
});
```

## CreateInterview
You can execute the `CreateInterview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createInterview(vars: CreateInterviewVariables): MutationPromise<CreateInterviewData, CreateInterviewVariables>;

interface CreateInterviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInterviewVariables): MutationRef<CreateInterviewData, CreateInterviewVariables>;
}
export const createInterviewRef: CreateInterviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createInterview(dc: DataConnect, vars: CreateInterviewVariables): MutationPromise<CreateInterviewData, CreateInterviewVariables>;

interface CreateInterviewRef {
  ...
  (dc: DataConnect, vars: CreateInterviewVariables): MutationRef<CreateInterviewData, CreateInterviewVariables>;
}
export const createInterviewRef: CreateInterviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createInterviewRef:
```typescript
const name = createInterviewRef.operationName;
console.log(name);
```

### Variables
The `CreateInterview` mutation requires an argument of type `CreateInterviewVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateInterviewVariables {
  candidateUid: string;
  companyId: UUIDString;
  title: string;
  round: string;
  date: TimestampString;
  time: string;
  mode?: string | null;
  meetingLink?: string | null;
  interviewers?: string[] | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateInterview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInterviewData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInterviewData {
  interview_insert: Interview_Key;
}
```
### Using `CreateInterview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInterview, CreateInterviewVariables } from '@skillsetu/dataconnect';

// The `CreateInterview` mutation requires an argument of type `CreateInterviewVariables`:
const createInterviewVars: CreateInterviewVariables = {
  candidateUid: ..., 
  companyId: ..., 
  title: ..., 
  round: ..., 
  date: ..., 
  time: ..., 
  mode: ..., // optional
  meetingLink: ..., // optional
  interviewers: ..., // optional
  notes: ..., // optional
};

// Call the `createInterview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInterview(createInterviewVars);
// Variables can be defined inline as well.
const { data } = await createInterview({ candidateUid: ..., companyId: ..., title: ..., round: ..., date: ..., time: ..., mode: ..., meetingLink: ..., interviewers: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInterview(dataConnect, createInterviewVars);

console.log(data.interview_insert);

// Or, you can use the `Promise` API.
createInterview(createInterviewVars).then((response) => {
  const data = response.data;
  console.log(data.interview_insert);
});
```

### Using `CreateInterview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInterviewRef, CreateInterviewVariables } from '@skillsetu/dataconnect';

// The `CreateInterview` mutation requires an argument of type `CreateInterviewVariables`:
const createInterviewVars: CreateInterviewVariables = {
  candidateUid: ..., 
  companyId: ..., 
  title: ..., 
  round: ..., 
  date: ..., 
  time: ..., 
  mode: ..., // optional
  meetingLink: ..., // optional
  interviewers: ..., // optional
  notes: ..., // optional
};

// Call the `createInterviewRef()` function to get a reference to the mutation.
const ref = createInterviewRef(createInterviewVars);
// Variables can be defined inline as well.
const ref = createInterviewRef({ candidateUid: ..., companyId: ..., title: ..., round: ..., date: ..., time: ..., mode: ..., meetingLink: ..., interviewers: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInterviewRef(dataConnect, createInterviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.interview_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.interview_insert);
});
```

## CreateChallenge
You can execute the `CreateChallenge` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createChallenge(vars: CreateChallengeVariables): MutationPromise<CreateChallengeData, CreateChallengeVariables>;

interface CreateChallengeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateChallengeVariables): MutationRef<CreateChallengeData, CreateChallengeVariables>;
}
export const createChallengeRef: CreateChallengeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createChallenge(dc: DataConnect, vars: CreateChallengeVariables): MutationPromise<CreateChallengeData, CreateChallengeVariables>;

interface CreateChallengeRef {
  ...
  (dc: DataConnect, vars: CreateChallengeVariables): MutationRef<CreateChallengeData, CreateChallengeVariables>;
}
export const createChallengeRef: CreateChallengeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createChallengeRef:
```typescript
const name = createChallengeRef.operationName;
console.log(name);
```

### Variables
The `CreateChallenge` mutation requires an argument of type `CreateChallengeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateChallengeVariables {
  companyId: UUIDString;
  title: string;
  description?: string | null;
  problemStatement?: string | null;
  requiredSkills?: string[] | null;
  difficulty?: string | null;
  deadline: TimestampString;
  teamSize?: string | null;
  prize?: string | null;
  submissionRequirements?: string | null;
  collegeParticipation?: string | null;
  status?: ChallengeStatus | null;
}
```
### Return Type
Recall that executing the `CreateChallenge` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateChallengeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateChallengeData {
  challenge_insert: Challenge_Key;
}
```
### Using `CreateChallenge`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createChallenge, CreateChallengeVariables } from '@skillsetu/dataconnect';

// The `CreateChallenge` mutation requires an argument of type `CreateChallengeVariables`:
const createChallengeVars: CreateChallengeVariables = {
  companyId: ..., 
  title: ..., 
  description: ..., // optional
  problemStatement: ..., // optional
  requiredSkills: ..., // optional
  difficulty: ..., // optional
  deadline: ..., 
  teamSize: ..., // optional
  prize: ..., // optional
  submissionRequirements: ..., // optional
  collegeParticipation: ..., // optional
  status: ..., // optional
};

// Call the `createChallenge()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createChallenge(createChallengeVars);
// Variables can be defined inline as well.
const { data } = await createChallenge({ companyId: ..., title: ..., description: ..., problemStatement: ..., requiredSkills: ..., difficulty: ..., deadline: ..., teamSize: ..., prize: ..., submissionRequirements: ..., collegeParticipation: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createChallenge(dataConnect, createChallengeVars);

console.log(data.challenge_insert);

// Or, you can use the `Promise` API.
createChallenge(createChallengeVars).then((response) => {
  const data = response.data;
  console.log(data.challenge_insert);
});
```

### Using `CreateChallenge`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createChallengeRef, CreateChallengeVariables } from '@skillsetu/dataconnect';

// The `CreateChallenge` mutation requires an argument of type `CreateChallengeVariables`:
const createChallengeVars: CreateChallengeVariables = {
  companyId: ..., 
  title: ..., 
  description: ..., // optional
  problemStatement: ..., // optional
  requiredSkills: ..., // optional
  difficulty: ..., // optional
  deadline: ..., 
  teamSize: ..., // optional
  prize: ..., // optional
  submissionRequirements: ..., // optional
  collegeParticipation: ..., // optional
  status: ..., // optional
};

// Call the `createChallengeRef()` function to get a reference to the mutation.
const ref = createChallengeRef(createChallengeVars);
// Variables can be defined inline as well.
const ref = createChallengeRef({ companyId: ..., title: ..., description: ..., problemStatement: ..., requiredSkills: ..., difficulty: ..., deadline: ..., teamSize: ..., prize: ..., submissionRequirements: ..., collegeParticipation: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createChallengeRef(dataConnect, createChallengeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.challenge_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.challenge_insert);
});
```

## CreateChallengeSubmission
You can execute the `CreateChallengeSubmission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createChallengeSubmission(vars: CreateChallengeSubmissionVariables): MutationPromise<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;

interface CreateChallengeSubmissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateChallengeSubmissionVariables): MutationRef<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
}
export const createChallengeSubmissionRef: CreateChallengeSubmissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createChallengeSubmission(dc: DataConnect, vars: CreateChallengeSubmissionVariables): MutationPromise<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;

interface CreateChallengeSubmissionRef {
  ...
  (dc: DataConnect, vars: CreateChallengeSubmissionVariables): MutationRef<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
}
export const createChallengeSubmissionRef: CreateChallengeSubmissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createChallengeSubmissionRef:
```typescript
const name = createChallengeSubmissionRef.operationName;
console.log(name);
```

### Variables
The `CreateChallengeSubmission` mutation requires an argument of type `CreateChallengeSubmissionVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateChallengeSubmissionVariables {
  challengeId: UUIDString;
  teamName: string;
  githubUrl: string;
  liveDemoUrl?: string | null;
  videoUrl?: string | null;
  skillsDemonstrated?: string[] | null;
}
```
### Return Type
Recall that executing the `CreateChallengeSubmission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateChallengeSubmissionData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateChallengeSubmissionData {
  challengeSubmission_insert: ChallengeSubmission_Key;
}
```
### Using `CreateChallengeSubmission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createChallengeSubmission, CreateChallengeSubmissionVariables } from '@skillsetu/dataconnect';

// The `CreateChallengeSubmission` mutation requires an argument of type `CreateChallengeSubmissionVariables`:
const createChallengeSubmissionVars: CreateChallengeSubmissionVariables = {
  challengeId: ..., 
  teamName: ..., 
  githubUrl: ..., 
  liveDemoUrl: ..., // optional
  videoUrl: ..., // optional
  skillsDemonstrated: ..., // optional
};

// Call the `createChallengeSubmission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createChallengeSubmission(createChallengeSubmissionVars);
// Variables can be defined inline as well.
const { data } = await createChallengeSubmission({ challengeId: ..., teamName: ..., githubUrl: ..., liveDemoUrl: ..., videoUrl: ..., skillsDemonstrated: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createChallengeSubmission(dataConnect, createChallengeSubmissionVars);

console.log(data.challengeSubmission_insert);

// Or, you can use the `Promise` API.
createChallengeSubmission(createChallengeSubmissionVars).then((response) => {
  const data = response.data;
  console.log(data.challengeSubmission_insert);
});
```

### Using `CreateChallengeSubmission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createChallengeSubmissionRef, CreateChallengeSubmissionVariables } from '@skillsetu/dataconnect';

// The `CreateChallengeSubmission` mutation requires an argument of type `CreateChallengeSubmissionVariables`:
const createChallengeSubmissionVars: CreateChallengeSubmissionVariables = {
  challengeId: ..., 
  teamName: ..., 
  githubUrl: ..., 
  liveDemoUrl: ..., // optional
  videoUrl: ..., // optional
  skillsDemonstrated: ..., // optional
};

// Call the `createChallengeSubmissionRef()` function to get a reference to the mutation.
const ref = createChallengeSubmissionRef(createChallengeSubmissionVars);
// Variables can be defined inline as well.
const ref = createChallengeSubmissionRef({ challengeId: ..., teamName: ..., githubUrl: ..., liveDemoUrl: ..., videoUrl: ..., skillsDemonstrated: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createChallengeSubmissionRef(dataConnect, createChallengeSubmissionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.challengeSubmission_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.challengeSubmission_insert);
});
```

## CreateOffer
You can execute the `CreateOffer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createOffer(vars: CreateOfferVariables): MutationPromise<CreateOfferData, CreateOfferVariables>;

interface CreateOfferRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOfferVariables): MutationRef<CreateOfferData, CreateOfferVariables>;
}
export const createOfferRef: CreateOfferRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOffer(dc: DataConnect, vars: CreateOfferVariables): MutationPromise<CreateOfferData, CreateOfferVariables>;

interface CreateOfferRef {
  ...
  (dc: DataConnect, vars: CreateOfferVariables): MutationRef<CreateOfferData, CreateOfferVariables>;
}
export const createOfferRef: CreateOfferRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOfferRef:
```typescript
const name = createOfferRef.operationName;
console.log(name);
```

### Variables
The `CreateOffer` mutation requires an argument of type `CreateOfferVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOfferVariables {
  candidateUid: string;
  companyId: UUIDString;
  jobOrInternshipId?: string | null;
  roleTitle: string;
  type: string;
  department?: string | null;
  location?: string | null;
  workMode?: string | null;
  compensation?: string | null;
  baseFixed?: string | null;
  variableBonus?: string | null;
  retentionJoiningBonus?: string | null;
  benefitsSummary?: string | null;
  joiningDate?: TimestampString | null;
  validUntil?: TimestampString | null;
  status?: OfferStatus | null;
  authorizedSignatory?: string | null;
  signatoryTitle?: string | null;
}
```
### Return Type
Recall that executing the `CreateOffer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOfferData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOfferData {
  offer_insert: Offer_Key;
}
```
### Using `CreateOffer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOffer, CreateOfferVariables } from '@skillsetu/dataconnect';

// The `CreateOffer` mutation requires an argument of type `CreateOfferVariables`:
const createOfferVars: CreateOfferVariables = {
  candidateUid: ..., 
  companyId: ..., 
  jobOrInternshipId: ..., // optional
  roleTitle: ..., 
  type: ..., 
  department: ..., // optional
  location: ..., // optional
  workMode: ..., // optional
  compensation: ..., // optional
  baseFixed: ..., // optional
  variableBonus: ..., // optional
  retentionJoiningBonus: ..., // optional
  benefitsSummary: ..., // optional
  joiningDate: ..., // optional
  validUntil: ..., // optional
  status: ..., // optional
  authorizedSignatory: ..., // optional
  signatoryTitle: ..., // optional
};

// Call the `createOffer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOffer(createOfferVars);
// Variables can be defined inline as well.
const { data } = await createOffer({ candidateUid: ..., companyId: ..., jobOrInternshipId: ..., roleTitle: ..., type: ..., department: ..., location: ..., workMode: ..., compensation: ..., baseFixed: ..., variableBonus: ..., retentionJoiningBonus: ..., benefitsSummary: ..., joiningDate: ..., validUntil: ..., status: ..., authorizedSignatory: ..., signatoryTitle: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOffer(dataConnect, createOfferVars);

console.log(data.offer_insert);

// Or, you can use the `Promise` API.
createOffer(createOfferVars).then((response) => {
  const data = response.data;
  console.log(data.offer_insert);
});
```

### Using `CreateOffer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOfferRef, CreateOfferVariables } from '@skillsetu/dataconnect';

// The `CreateOffer` mutation requires an argument of type `CreateOfferVariables`:
const createOfferVars: CreateOfferVariables = {
  candidateUid: ..., 
  companyId: ..., 
  jobOrInternshipId: ..., // optional
  roleTitle: ..., 
  type: ..., 
  department: ..., // optional
  location: ..., // optional
  workMode: ..., // optional
  compensation: ..., // optional
  baseFixed: ..., // optional
  variableBonus: ..., // optional
  retentionJoiningBonus: ..., // optional
  benefitsSummary: ..., // optional
  joiningDate: ..., // optional
  validUntil: ..., // optional
  status: ..., // optional
  authorizedSignatory: ..., // optional
  signatoryTitle: ..., // optional
};

// Call the `createOfferRef()` function to get a reference to the mutation.
const ref = createOfferRef(createOfferVars);
// Variables can be defined inline as well.
const ref = createOfferRef({ candidateUid: ..., companyId: ..., jobOrInternshipId: ..., roleTitle: ..., type: ..., department: ..., location: ..., workMode: ..., compensation: ..., baseFixed: ..., variableBonus: ..., retentionJoiningBonus: ..., benefitsSummary: ..., joiningDate: ..., validUntil: ..., status: ..., authorizedSignatory: ..., signatoryTitle: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOfferRef(dataConnect, createOfferVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.offer_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.offer_insert);
});
```

## CreateCurriculumModule
You can execute the `CreateCurriculumModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCurriculumModule(vars: CreateCurriculumModuleVariables): MutationPromise<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;

interface CreateCurriculumModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCurriculumModuleVariables): MutationRef<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
}
export const createCurriculumModuleRef: CreateCurriculumModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCurriculumModule(dc: DataConnect, vars: CreateCurriculumModuleVariables): MutationPromise<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;

interface CreateCurriculumModuleRef {
  ...
  (dc: DataConnect, vars: CreateCurriculumModuleVariables): MutationRef<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
}
export const createCurriculumModuleRef: CreateCurriculumModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCurriculumModuleRef:
```typescript
const name = createCurriculumModuleRef.operationName;
console.log(name);
```

### Variables
The `CreateCurriculumModule` mutation requires an argument of type `CreateCurriculumModuleVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCurriculumModuleVariables {
  collegeCompanyCollegeId: UUIDString;
  collegeCompanyCompanyId: UUIDString;
  semester: string;
  currentSubject: string;
  industryRecommendation?: string | null;
  recommendedTechnologies?: string[] | null;
  rationale?: string | null;
  status?: CurriculumStatus | null;
}
```
### Return Type
Recall that executing the `CreateCurriculumModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCurriculumModuleData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCurriculumModuleData {
  curriculumModule_insert: CurriculumModule_Key;
}
```
### Using `CreateCurriculumModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCurriculumModule, CreateCurriculumModuleVariables } from '@skillsetu/dataconnect';

// The `CreateCurriculumModule` mutation requires an argument of type `CreateCurriculumModuleVariables`:
const createCurriculumModuleVars: CreateCurriculumModuleVariables = {
  collegeCompanyCollegeId: ..., 
  collegeCompanyCompanyId: ..., 
  semester: ..., 
  currentSubject: ..., 
  industryRecommendation: ..., // optional
  recommendedTechnologies: ..., // optional
  rationale: ..., // optional
  status: ..., // optional
};

// Call the `createCurriculumModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCurriculumModule(createCurriculumModuleVars);
// Variables can be defined inline as well.
const { data } = await createCurriculumModule({ collegeCompanyCollegeId: ..., collegeCompanyCompanyId: ..., semester: ..., currentSubject: ..., industryRecommendation: ..., recommendedTechnologies: ..., rationale: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCurriculumModule(dataConnect, createCurriculumModuleVars);

console.log(data.curriculumModule_insert);

// Or, you can use the `Promise` API.
createCurriculumModule(createCurriculumModuleVars).then((response) => {
  const data = response.data;
  console.log(data.curriculumModule_insert);
});
```

### Using `CreateCurriculumModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCurriculumModuleRef, CreateCurriculumModuleVariables } from '@skillsetu/dataconnect';

// The `CreateCurriculumModule` mutation requires an argument of type `CreateCurriculumModuleVariables`:
const createCurriculumModuleVars: CreateCurriculumModuleVariables = {
  collegeCompanyCollegeId: ..., 
  collegeCompanyCompanyId: ..., 
  semester: ..., 
  currentSubject: ..., 
  industryRecommendation: ..., // optional
  recommendedTechnologies: ..., // optional
  rationale: ..., // optional
  status: ..., // optional
};

// Call the `createCurriculumModuleRef()` function to get a reference to the mutation.
const ref = createCurriculumModuleRef(createCurriculumModuleVars);
// Variables can be defined inline as well.
const ref = createCurriculumModuleRef({ collegeCompanyCollegeId: ..., collegeCompanyCompanyId: ..., semester: ..., currentSubject: ..., industryRecommendation: ..., recommendedTechnologies: ..., rationale: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCurriculumModuleRef(dataConnect, createCurriculumModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.curriculumModule_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.curriculumModule_insert);
});
```

## UpsertHiringPreferences
You can execute the `UpsertHiringPreferences` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertHiringPreferences(vars: UpsertHiringPreferencesVariables): MutationPromise<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;

interface UpsertHiringPreferencesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertHiringPreferencesVariables): MutationRef<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
}
export const upsertHiringPreferencesRef: UpsertHiringPreferencesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertHiringPreferences(dc: DataConnect, vars: UpsertHiringPreferencesVariables): MutationPromise<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;

interface UpsertHiringPreferencesRef {
  ...
  (dc: DataConnect, vars: UpsertHiringPreferencesVariables): MutationRef<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
}
export const upsertHiringPreferencesRef: UpsertHiringPreferencesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertHiringPreferencesRef:
```typescript
const name = upsertHiringPreferencesRef.operationName;
console.log(name);
```

### Variables
The `UpsertHiringPreferences` mutation requires an argument of type `UpsertHiringPreferencesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertHiringPreferencesVariables {
  companyId: UUIDString;
  preferredDepartments?: string[] | null;
  preferredDegrees?: string[] | null;
  preferredGraduationYears?: string[] | null;
  preferredLocations?: string[] | null;
  workModes?: string[] | null;
  minimumCgpa?: number | null;
  prioritizeVerifiedSkills?: boolean | null;
  prioritizeStartupExperience?: boolean | null;
  searchRadiusKm?: number | null;
}
```
### Return Type
Recall that executing the `UpsertHiringPreferences` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertHiringPreferencesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertHiringPreferencesData {
  hiringPreferences_upsert: HiringPreferences_Key;
}
```
### Using `UpsertHiringPreferences`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertHiringPreferences, UpsertHiringPreferencesVariables } from '@skillsetu/dataconnect';

// The `UpsertHiringPreferences` mutation requires an argument of type `UpsertHiringPreferencesVariables`:
const upsertHiringPreferencesVars: UpsertHiringPreferencesVariables = {
  companyId: ..., 
  preferredDepartments: ..., // optional
  preferredDegrees: ..., // optional
  preferredGraduationYears: ..., // optional
  preferredLocations: ..., // optional
  workModes: ..., // optional
  minimumCgpa: ..., // optional
  prioritizeVerifiedSkills: ..., // optional
  prioritizeStartupExperience: ..., // optional
  searchRadiusKm: ..., // optional
};

// Call the `upsertHiringPreferences()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertHiringPreferences(upsertHiringPreferencesVars);
// Variables can be defined inline as well.
const { data } = await upsertHiringPreferences({ companyId: ..., preferredDepartments: ..., preferredDegrees: ..., preferredGraduationYears: ..., preferredLocations: ..., workModes: ..., minimumCgpa: ..., prioritizeVerifiedSkills: ..., prioritizeStartupExperience: ..., searchRadiusKm: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertHiringPreferences(dataConnect, upsertHiringPreferencesVars);

console.log(data.hiringPreferences_upsert);

// Or, you can use the `Promise` API.
upsertHiringPreferences(upsertHiringPreferencesVars).then((response) => {
  const data = response.data;
  console.log(data.hiringPreferences_upsert);
});
```

### Using `UpsertHiringPreferences`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertHiringPreferencesRef, UpsertHiringPreferencesVariables } from '@skillsetu/dataconnect';

// The `UpsertHiringPreferences` mutation requires an argument of type `UpsertHiringPreferencesVariables`:
const upsertHiringPreferencesVars: UpsertHiringPreferencesVariables = {
  companyId: ..., 
  preferredDepartments: ..., // optional
  preferredDegrees: ..., // optional
  preferredGraduationYears: ..., // optional
  preferredLocations: ..., // optional
  workModes: ..., // optional
  minimumCgpa: ..., // optional
  prioritizeVerifiedSkills: ..., // optional
  prioritizeStartupExperience: ..., // optional
  searchRadiusKm: ..., // optional
};

// Call the `upsertHiringPreferencesRef()` function to get a reference to the mutation.
const ref = upsertHiringPreferencesRef(upsertHiringPreferencesVars);
// Variables can be defined inline as well.
const ref = upsertHiringPreferencesRef({ companyId: ..., preferredDepartments: ..., preferredDegrees: ..., preferredGraduationYears: ..., preferredLocations: ..., workModes: ..., minimumCgpa: ..., prioritizeVerifiedSkills: ..., prioritizeStartupExperience: ..., searchRadiusKm: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertHiringPreferencesRef(dataConnect, upsertHiringPreferencesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.hiringPreferences_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.hiringPreferences_upsert);
});
```

