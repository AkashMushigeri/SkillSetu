# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `skillsetu`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@skillsetu/dataconnect/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `skillsetu`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `skillsetu`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `skillsetu` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListCompanies
You can execute the `ListCompanies` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListCompanies(dc: DataConnect, options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanies(options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;
```

### Variables
The `ListCompanies` Query has no variables.
### Return Type
Recall that calling the `ListCompanies` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanies` Query is of type `ListCompaniesData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanies`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListCompanies } from '@skillsetu/dataconnect/react'

export default function ListCompaniesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanies();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanies(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanies(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanies(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.companies);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetCompany
You can execute the `GetCompany` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useGetCompany(dc: DataConnect, vars: GetCompanyVariables, options?: useDataConnectQueryOptions<GetCompanyData>): UseDataConnectQueryResult<GetCompanyData, GetCompanyVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCompany(vars: GetCompanyVariables, options?: useDataConnectQueryOptions<GetCompanyData>): UseDataConnectQueryResult<GetCompanyData, GetCompanyVariables>;
```

### Variables
The `GetCompany` Query requires an argument of type `GetCompanyVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCompanyVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetCompany` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCompany` Query is of type `GetCompanyData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCompany`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetCompanyVariables } from '@skillsetu/dataconnect';
import { useGetCompany } from '@skillsetu/dataconnect/react'

export default function GetCompanyComponent() {
  // The `useGetCompany` Query hook requires an argument of type `GetCompanyVariables`:
  const getCompanyVars: GetCompanyVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCompany(getCompanyVars);
  // Variables can be defined inline as well.
  const query = useGetCompany({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCompany(dataConnect, getCompanyVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCompany(getCompanyVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCompany(dataConnect, getCompanyVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.company);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyCompany
You can execute the `GetMyCompany` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useGetMyCompany(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyCompanyData>): UseDataConnectQueryResult<GetMyCompanyData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyCompany(options?: useDataConnectQueryOptions<GetMyCompanyData>): UseDataConnectQueryResult<GetMyCompanyData, undefined>;
```

### Variables
The `GetMyCompany` Query has no variables.
### Return Type
Recall that calling the `GetMyCompany` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyCompany` Query is of type `GetMyCompanyData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetMyCompanyData {
  companies: ({
    id: UUIDString;
  } & Company_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyCompany`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useGetMyCompany } from '@skillsetu/dataconnect/react'

export default function GetMyCompanyComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyCompany();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyCompany(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyCompany(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyCompany(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.companies);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyCollege
You can execute the `GetMyCollege` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useGetMyCollege(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyCollegeData>): UseDataConnectQueryResult<GetMyCollegeData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyCollege(options?: useDataConnectQueryOptions<GetMyCollegeData>): UseDataConnectQueryResult<GetMyCollegeData, undefined>;
```

### Variables
The `GetMyCollege` Query has no variables.
### Return Type
Recall that calling the `GetMyCollege` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyCollege` Query is of type `GetMyCollegeData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetMyCollegeData {
  colleges: ({
    id: UUIDString;
  } & College_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyCollege`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useGetMyCollege } from '@skillsetu/dataconnect/react'

export default function GetMyCollegeComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyCollege();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyCollege(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyCollege(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyCollege(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.colleges);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyEducation
You can execute the `GetMyEducation` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useGetMyEducation(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyEducationData>): UseDataConnectQueryResult<GetMyEducationData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyEducation(options?: useDataConnectQueryOptions<GetMyEducationData>): UseDataConnectQueryResult<GetMyEducationData, undefined>;
```

### Variables
The `GetMyEducation` Query has no variables.
### Return Type
Recall that calling the `GetMyEducation` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyEducation` Query is of type `GetMyEducationData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyEducation`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useGetMyEducation } from '@skillsetu/dataconnect/react'

export default function GetMyEducationComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyEducation();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyEducation(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyEducation(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyEducation(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListColleges
You can execute the `ListColleges` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListColleges(dc: DataConnect, options?: useDataConnectQueryOptions<ListCollegesData>): UseDataConnectQueryResult<ListCollegesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListColleges(options?: useDataConnectQueryOptions<ListCollegesData>): UseDataConnectQueryResult<ListCollegesData, undefined>;
```

### Variables
The `ListColleges` Query has no variables.
### Return Type
Recall that calling the `ListColleges` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListColleges` Query is of type `ListCollegesData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListColleges`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListColleges } from '@skillsetu/dataconnect/react'

export default function ListCollegesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListColleges();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListColleges(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListColleges(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListColleges(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.colleges);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyProfile
You can execute the `GetMyProfile` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useGetMyProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyProfile(options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
```

### Variables
The `GetMyProfile` Query has no variables.
### Return Type
Recall that calling the `GetMyProfile` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyProfile` Query is of type `GetMyProfileData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyProfile`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useGetMyProfile } from '@skillsetu/dataconnect/react'

export default function GetMyProfileComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyProfile();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyProfile(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyProfile(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## SearchCandidates
You can execute the `SearchCandidates` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useSearchCandidates(dc: DataConnect, vars?: SearchCandidatesVariables, options?: useDataConnectQueryOptions<SearchCandidatesData>): UseDataConnectQueryResult<SearchCandidatesData, SearchCandidatesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useSearchCandidates(vars?: SearchCandidatesVariables, options?: useDataConnectQueryOptions<SearchCandidatesData>): UseDataConnectQueryResult<SearchCandidatesData, SearchCandidatesVariables>;
```

### Variables
The `SearchCandidates` Query has an optional argument of type `SearchCandidatesVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchCandidatesVariables {
  skillNames?: string[] | null;
}
```
### Return Type
Recall that calling the `SearchCandidates` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `SearchCandidates` Query is of type `SearchCandidatesData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `SearchCandidates`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SearchCandidatesVariables } from '@skillsetu/dataconnect';
import { useSearchCandidates } from '@skillsetu/dataconnect/react'

export default function SearchCandidatesComponent() {
  // The `useSearchCandidates` Query hook has an optional argument of type `SearchCandidatesVariables`:
  const searchCandidatesVars: SearchCandidatesVariables = {
    skillNames: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useSearchCandidates(searchCandidatesVars);
  // Variables can be defined inline as well.
  const query = useSearchCandidates({ skillNames: ..., });
  // Since all variables are optional for this Query, you can omit the `SearchCandidatesVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useSearchCandidates();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useSearchCandidates(dataConnect, searchCandidatesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useSearchCandidates(searchCandidatesVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useSearchCandidates(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useSearchCandidates(dataConnect, searchCandidatesVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.candidates);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetCandidateProfile
You can execute the `GetCandidateProfile` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useGetCandidateProfile(dc: DataConnect, vars: GetCandidateProfileVariables, options?: useDataConnectQueryOptions<GetCandidateProfileData>): UseDataConnectQueryResult<GetCandidateProfileData, GetCandidateProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCandidateProfile(vars: GetCandidateProfileVariables, options?: useDataConnectQueryOptions<GetCandidateProfileData>): UseDataConnectQueryResult<GetCandidateProfileData, GetCandidateProfileVariables>;
```

### Variables
The `GetCandidateProfile` Query requires an argument of type `GetCandidateProfileVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCandidateProfileVariables {
  uid: string;
}
```
### Return Type
Recall that calling the `GetCandidateProfile` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCandidateProfile` Query is of type `GetCandidateProfileData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCandidateProfile`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetCandidateProfileVariables } from '@skillsetu/dataconnect';
import { useGetCandidateProfile } from '@skillsetu/dataconnect/react'

export default function GetCandidateProfileComponent() {
  // The `useGetCandidateProfile` Query hook requires an argument of type `GetCandidateProfileVariables`:
  const getCandidateProfileVars: GetCandidateProfileVariables = {
    uid: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCandidateProfile(getCandidateProfileVars);
  // Variables can be defined inline as well.
  const query = useGetCandidateProfile({ uid: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCandidateProfile(dataConnect, getCandidateProfileVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCandidateProfile(getCandidateProfileVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCandidateProfile(dataConnect, getCandidateProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListJobs
You can execute the `ListJobs` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListJobs(dc: DataConnect, options?: useDataConnectQueryOptions<ListJobsData>): UseDataConnectQueryResult<ListJobsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListJobs(options?: useDataConnectQueryOptions<ListJobsData>): UseDataConnectQueryResult<ListJobsData, undefined>;
```

### Variables
The `ListJobs` Query has no variables.
### Return Type
Recall that calling the `ListJobs` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListJobs` Query is of type `ListJobsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListJobs`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListJobs } from '@skillsetu/dataconnect/react'

export default function ListJobsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListJobs();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListJobs(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListJobs(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListJobs(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.jobs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListInternships
You can execute the `ListInternships` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListInternships(dc: DataConnect, options?: useDataConnectQueryOptions<ListInternshipsData>): UseDataConnectQueryResult<ListInternshipsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListInternships(options?: useDataConnectQueryOptions<ListInternshipsData>): UseDataConnectQueryResult<ListInternshipsData, undefined>;
```

### Variables
The `ListInternships` Query has no variables.
### Return Type
Recall that calling the `ListInternships` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListInternships` Query is of type `ListInternshipsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListInternships`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListInternships } from '@skillsetu/dataconnect/react'

export default function ListInternshipsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListInternships();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListInternships(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListInternships(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListInternships(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.internships);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyApplications
You can execute the `ListMyApplications` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListMyApplications(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyApplicationsData>): UseDataConnectQueryResult<ListMyApplicationsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyApplications(options?: useDataConnectQueryOptions<ListMyApplicationsData>): UseDataConnectQueryResult<ListMyApplicationsData, undefined>;
```

### Variables
The `ListMyApplications` Query has no variables.
### Return Type
Recall that calling the `ListMyApplications` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyApplications` Query is of type `ListMyApplicationsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyApplications`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListMyApplications } from '@skillsetu/dataconnect/react'

export default function ListMyApplicationsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyApplications();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyApplications(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyApplications(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyApplications(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.applications);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCompanyApplications
You can execute the `ListCompanyApplications` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListCompanyApplications(dc: DataConnect, vars: ListCompanyApplicationsVariables, options?: useDataConnectQueryOptions<ListCompanyApplicationsData>): UseDataConnectQueryResult<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanyApplications(vars: ListCompanyApplicationsVariables, options?: useDataConnectQueryOptions<ListCompanyApplicationsData>): UseDataConnectQueryResult<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
```

### Variables
The `ListCompanyApplications` Query requires an argument of type `ListCompanyApplicationsVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCompanyApplicationsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that calling the `ListCompanyApplications` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanyApplications` Query is of type `ListCompanyApplicationsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanyApplications`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCompanyApplicationsVariables } from '@skillsetu/dataconnect';
import { useListCompanyApplications } from '@skillsetu/dataconnect/react'

export default function ListCompanyApplicationsComponent() {
  // The `useListCompanyApplications` Query hook requires an argument of type `ListCompanyApplicationsVariables`:
  const listCompanyApplicationsVars: ListCompanyApplicationsVariables = {
    companyId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanyApplications(listCompanyApplicationsVars);
  // Variables can be defined inline as well.
  const query = useListCompanyApplications({ companyId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanyApplications(dataConnect, listCompanyApplicationsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyApplications(listCompanyApplicationsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyApplications(dataConnect, listCompanyApplicationsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.applications);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyInterviews
You can execute the `ListMyInterviews` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListMyInterviews(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyInterviewsData>): UseDataConnectQueryResult<ListMyInterviewsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyInterviews(options?: useDataConnectQueryOptions<ListMyInterviewsData>): UseDataConnectQueryResult<ListMyInterviewsData, undefined>;
```

### Variables
The `ListMyInterviews` Query has no variables.
### Return Type
Recall that calling the `ListMyInterviews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyInterviews` Query is of type `ListMyInterviewsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyInterviews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListMyInterviews } from '@skillsetu/dataconnect/react'

export default function ListMyInterviewsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyInterviews();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyInterviews(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyInterviews(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyInterviews(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.interviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCompanyInterviews
You can execute the `ListCompanyInterviews` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListCompanyInterviews(dc: DataConnect, vars: ListCompanyInterviewsVariables, options?: useDataConnectQueryOptions<ListCompanyInterviewsData>): UseDataConnectQueryResult<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanyInterviews(vars: ListCompanyInterviewsVariables, options?: useDataConnectQueryOptions<ListCompanyInterviewsData>): UseDataConnectQueryResult<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
```

### Variables
The `ListCompanyInterviews` Query requires an argument of type `ListCompanyInterviewsVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCompanyInterviewsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that calling the `ListCompanyInterviews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanyInterviews` Query is of type `ListCompanyInterviewsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanyInterviews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCompanyInterviewsVariables } from '@skillsetu/dataconnect';
import { useListCompanyInterviews } from '@skillsetu/dataconnect/react'

export default function ListCompanyInterviewsComponent() {
  // The `useListCompanyInterviews` Query hook requires an argument of type `ListCompanyInterviewsVariables`:
  const listCompanyInterviewsVars: ListCompanyInterviewsVariables = {
    companyId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanyInterviews(listCompanyInterviewsVars);
  // Variables can be defined inline as well.
  const query = useListCompanyInterviews({ companyId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanyInterviews(dataConnect, listCompanyInterviewsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyInterviews(listCompanyInterviewsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyInterviews(dataConnect, listCompanyInterviewsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.interviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListChallenges
You can execute the `ListChallenges` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListChallenges(dc: DataConnect, options?: useDataConnectQueryOptions<ListChallengesData>): UseDataConnectQueryResult<ListChallengesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListChallenges(options?: useDataConnectQueryOptions<ListChallengesData>): UseDataConnectQueryResult<ListChallengesData, undefined>;
```

### Variables
The `ListChallenges` Query has no variables.
### Return Type
Recall that calling the `ListChallenges` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListChallenges` Query is of type `ListChallengesData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListChallenges`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListChallenges } from '@skillsetu/dataconnect/react'

export default function ListChallengesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListChallenges();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListChallenges(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListChallenges(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListChallenges(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.challenges);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetChallenge
You can execute the `GetChallenge` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useGetChallenge(dc: DataConnect, vars: GetChallengeVariables, options?: useDataConnectQueryOptions<GetChallengeData>): UseDataConnectQueryResult<GetChallengeData, GetChallengeVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetChallenge(vars: GetChallengeVariables, options?: useDataConnectQueryOptions<GetChallengeData>): UseDataConnectQueryResult<GetChallengeData, GetChallengeVariables>;
```

### Variables
The `GetChallenge` Query requires an argument of type `GetChallengeVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetChallengeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetChallenge` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetChallenge` Query is of type `GetChallengeData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetChallenge`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetChallengeVariables } from '@skillsetu/dataconnect';
import { useGetChallenge } from '@skillsetu/dataconnect/react'

export default function GetChallengeComponent() {
  // The `useGetChallenge` Query hook requires an argument of type `GetChallengeVariables`:
  const getChallengeVars: GetChallengeVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetChallenge(getChallengeVars);
  // Variables can be defined inline as well.
  const query = useGetChallenge({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetChallenge(dataConnect, getChallengeVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetChallenge(getChallengeVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetChallenge(dataConnect, getChallengeVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.challenge);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListChallengeSubmissions
You can execute the `ListChallengeSubmissions` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListChallengeSubmissions(dc: DataConnect, vars: ListChallengeSubmissionsVariables, options?: useDataConnectQueryOptions<ListChallengeSubmissionsData>): UseDataConnectQueryResult<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListChallengeSubmissions(vars: ListChallengeSubmissionsVariables, options?: useDataConnectQueryOptions<ListChallengeSubmissionsData>): UseDataConnectQueryResult<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
```

### Variables
The `ListChallengeSubmissions` Query requires an argument of type `ListChallengeSubmissionsVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListChallengeSubmissionsVariables {
  challengeId: UUIDString;
}
```
### Return Type
Recall that calling the `ListChallengeSubmissions` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListChallengeSubmissions` Query is of type `ListChallengeSubmissionsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListChallengeSubmissions`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListChallengeSubmissionsVariables } from '@skillsetu/dataconnect';
import { useListChallengeSubmissions } from '@skillsetu/dataconnect/react'

export default function ListChallengeSubmissionsComponent() {
  // The `useListChallengeSubmissions` Query hook requires an argument of type `ListChallengeSubmissionsVariables`:
  const listChallengeSubmissionsVars: ListChallengeSubmissionsVariables = {
    challengeId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListChallengeSubmissions(listChallengeSubmissionsVars);
  // Variables can be defined inline as well.
  const query = useListChallengeSubmissions({ challengeId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListChallengeSubmissions(dataConnect, listChallengeSubmissionsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListChallengeSubmissions(listChallengeSubmissionsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListChallengeSubmissions(dataConnect, listChallengeSubmissionsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.challengeSubmissions);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyOffers
You can execute the `ListMyOffers` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListMyOffers(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyOffersData>): UseDataConnectQueryResult<ListMyOffersData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyOffers(options?: useDataConnectQueryOptions<ListMyOffersData>): UseDataConnectQueryResult<ListMyOffersData, undefined>;
```

### Variables
The `ListMyOffers` Query has no variables.
### Return Type
Recall that calling the `ListMyOffers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyOffers` Query is of type `ListMyOffersData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyOffers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListMyOffers } from '@skillsetu/dataconnect/react'

export default function ListMyOffersComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyOffers();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyOffers(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyOffers(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyOffers(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.offers);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMoUs
You can execute the `ListMoUs` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListMoUs(dc: DataConnect, options?: useDataConnectQueryOptions<ListMoUsData>): UseDataConnectQueryResult<ListMoUsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMoUs(options?: useDataConnectQueryOptions<ListMoUsData>): UseDataConnectQueryResult<ListMoUsData, undefined>;
```

### Variables
The `ListMoUs` Query has no variables.
### Return Type
Recall that calling the `ListMoUs` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMoUs` Query is of type `ListMoUsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMoUs`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListMoUs } from '@skillsetu/dataconnect/react'

export default function ListMoUsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMoUs();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMoUs(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMoUs(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMoUs(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.collegeCompanies);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMoUsForCollege
You can execute the `ListMoUsForCollege` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListMoUsForCollege(dc: DataConnect, options?: useDataConnectQueryOptions<ListMoUsForCollegeData>): UseDataConnectQueryResult<ListMoUsForCollegeData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMoUsForCollege(options?: useDataConnectQueryOptions<ListMoUsForCollegeData>): UseDataConnectQueryResult<ListMoUsForCollegeData, undefined>;
```

### Variables
The `ListMoUsForCollege` Query has no variables.
### Return Type
Recall that calling the `ListMoUsForCollege` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMoUsForCollege` Query is of type `ListMoUsForCollegeData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMoUsForCollege`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListMoUsForCollege } from '@skillsetu/dataconnect/react'

export default function ListMoUsForCollegeComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMoUsForCollege();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMoUsForCollege(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMoUsForCollege(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMoUsForCollege(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.collegeCompanies);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListSkills
You can execute the `ListSkills` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListSkills(dc: DataConnect, options?: useDataConnectQueryOptions<ListSkillsData>): UseDataConnectQueryResult<ListSkillsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSkills(options?: useDataConnectQueryOptions<ListSkillsData>): UseDataConnectQueryResult<ListSkillsData, undefined>;
```

### Variables
The `ListSkills` Query has no variables.
### Return Type
Recall that calling the `ListSkills` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListSkills` Query is of type `ListSkillsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListSkillsData {
  skills: ({
    id: UUIDString;
    name: string;
    category?: string | null;
    description?: string | null;
  } & Skill_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListSkills`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListSkills } from '@skillsetu/dataconnect/react'

export default function ListSkillsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSkills();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSkills(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSkills(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSkills(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.skills);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMySkills
You can execute the `ListMySkills` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListMySkills(dc: DataConnect, options?: useDataConnectQueryOptions<ListMySkillsData>): UseDataConnectQueryResult<ListMySkillsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMySkills(options?: useDataConnectQueryOptions<ListMySkillsData>): UseDataConnectQueryResult<ListMySkillsData, undefined>;
```

### Variables
The `ListMySkills` Query has no variables.
### Return Type
Recall that calling the `ListMySkills` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMySkills` Query is of type `ListMySkillsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMySkills`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@skillsetu/dataconnect';
import { useListMySkills } from '@skillsetu/dataconnect/react'

export default function ListMySkillsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMySkills();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMySkills(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMySkills(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMySkills(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userSkills);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCompanyJobs
You can execute the `ListCompanyJobs` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListCompanyJobs(dc: DataConnect, vars: ListCompanyJobsVariables, options?: useDataConnectQueryOptions<ListCompanyJobsData>): UseDataConnectQueryResult<ListCompanyJobsData, ListCompanyJobsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanyJobs(vars: ListCompanyJobsVariables, options?: useDataConnectQueryOptions<ListCompanyJobsData>): UseDataConnectQueryResult<ListCompanyJobsData, ListCompanyJobsVariables>;
```

### Variables
The `ListCompanyJobs` Query requires an argument of type `ListCompanyJobsVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCompanyJobsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that calling the `ListCompanyJobs` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanyJobs` Query is of type `ListCompanyJobsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanyJobs`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCompanyJobsVariables } from '@skillsetu/dataconnect';
import { useListCompanyJobs } from '@skillsetu/dataconnect/react'

export default function ListCompanyJobsComponent() {
  // The `useListCompanyJobs` Query hook requires an argument of type `ListCompanyJobsVariables`:
  const listCompanyJobsVars: ListCompanyJobsVariables = {
    companyId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanyJobs(listCompanyJobsVars);
  // Variables can be defined inline as well.
  const query = useListCompanyJobs({ companyId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanyJobs(dataConnect, listCompanyJobsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyJobs(listCompanyJobsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyJobs(dataConnect, listCompanyJobsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.jobs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCompanyInternships
You can execute the `ListCompanyInternships` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListCompanyInternships(dc: DataConnect, vars: ListCompanyInternshipsVariables, options?: useDataConnectQueryOptions<ListCompanyInternshipsData>): UseDataConnectQueryResult<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanyInternships(vars: ListCompanyInternshipsVariables, options?: useDataConnectQueryOptions<ListCompanyInternshipsData>): UseDataConnectQueryResult<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
```

### Variables
The `ListCompanyInternships` Query requires an argument of type `ListCompanyInternshipsVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCompanyInternshipsVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that calling the `ListCompanyInternships` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanyInternships` Query is of type `ListCompanyInternshipsData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanyInternships`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCompanyInternshipsVariables } from '@skillsetu/dataconnect';
import { useListCompanyInternships } from '@skillsetu/dataconnect/react'

export default function ListCompanyInternshipsComponent() {
  // The `useListCompanyInternships` Query hook requires an argument of type `ListCompanyInternshipsVariables`:
  const listCompanyInternshipsVars: ListCompanyInternshipsVariables = {
    companyId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanyInternships(listCompanyInternshipsVars);
  // Variables can be defined inline as well.
  const query = useListCompanyInternships({ companyId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanyInternships(dataConnect, listCompanyInternshipsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyInternships(listCompanyInternshipsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyInternships(dataConnect, listCompanyInternshipsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.internships);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCompanyChallenges
You can execute the `ListCompanyChallenges` Query using the following Query hook function, which is defined in [dataconnect/react/index.d.ts](./index.d.ts):

```javascript
useListCompanyChallenges(dc: DataConnect, vars: ListCompanyChallengesVariables, options?: useDataConnectQueryOptions<ListCompanyChallengesData>): UseDataConnectQueryResult<ListCompanyChallengesData, ListCompanyChallengesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanyChallenges(vars: ListCompanyChallengesVariables, options?: useDataConnectQueryOptions<ListCompanyChallengesData>): UseDataConnectQueryResult<ListCompanyChallengesData, ListCompanyChallengesVariables>;
```

### Variables
The `ListCompanyChallenges` Query requires an argument of type `ListCompanyChallengesVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCompanyChallengesVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that calling the `ListCompanyChallenges` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanyChallenges` Query is of type `ListCompanyChallengesData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanyChallenges`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCompanyChallengesVariables } from '@skillsetu/dataconnect';
import { useListCompanyChallenges } from '@skillsetu/dataconnect/react'

export default function ListCompanyChallengesComponent() {
  // The `useListCompanyChallenges` Query hook requires an argument of type `ListCompanyChallengesVariables`:
  const listCompanyChallengesVars: ListCompanyChallengesVariables = {
    companyId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanyChallenges(listCompanyChallengesVars);
  // Variables can be defined inline as well.
  const query = useListCompanyChallenges({ companyId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanyChallenges(dataConnect, listCompanyChallengesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyChallenges(listCompanyChallengesVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyChallenges(dataConnect, listCompanyChallengesVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.challenges);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `skillsetu` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## UpsertStudentProfile
You can execute the `UpsertStudentProfile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertStudentProfile(options?: useDataConnectMutationOptions<UpsertStudentProfileData, FirebaseError, UpsertStudentProfileVariables>): UseDataConnectMutationResult<UpsertStudentProfileData, UpsertStudentProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertStudentProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertStudentProfileData, FirebaseError, UpsertStudentProfileVariables>): UseDataConnectMutationResult<UpsertStudentProfileData, UpsertStudentProfileVariables>;
```

### Variables
The `UpsertStudentProfile` Mutation requires an argument of type `UpsertStudentProfileVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertStudentProfile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertStudentProfile` Mutation is of type `UpsertStudentProfileData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertStudentProfileData {
  user_upsert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertStudentProfile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertStudentProfileVariables } from '@skillsetu/dataconnect';
import { useUpsertStudentProfile } from '@skillsetu/dataconnect/react'

export default function UpsertStudentProfileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertStudentProfile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertStudentProfile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertStudentProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertStudentProfile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertStudentProfile` Mutation requires an argument of type `UpsertStudentProfileVariables`:
  const upsertStudentProfileVars: UpsertStudentProfileVariables = {
    displayName: ..., 
    email: ..., 
    photoUrl: ..., // optional
    college: ..., // optional
    location: ..., // optional
    phone: ..., // optional
  };
  mutation.mutate(upsertStudentProfileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ displayName: ..., email: ..., photoUrl: ..., college: ..., location: ..., phone: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertStudentProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertUserProfile
You can execute the `UpsertUserProfile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUserProfile(options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;
```

### Variables
The `UpsertUserProfile` Mutation requires an argument of type `UpsertUserProfileVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertUserProfile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertUserProfile` Mutation is of type `UpsertUserProfileData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserProfileData {
  user_upsert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertUserProfile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserProfileVariables } from '@skillsetu/dataconnect';
import { useUpsertUserProfile } from '@skillsetu/dataconnect/react'

export default function UpsertUserProfileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUserProfile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUserProfile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserProfile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUserProfile` Mutation requires an argument of type `UpsertUserProfileVariables`:
  const upsertUserProfileVars: UpsertUserProfileVariables = {
    displayName: ..., 
    email: ..., 
    role: ..., 
    photoUrl: ..., // optional
    college: ..., // optional
    location: ..., // optional
    phone: ..., // optional
  };
  mutation.mutate(upsertUserProfileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ displayName: ..., email: ..., role: ..., photoUrl: ..., college: ..., location: ..., phone: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUserProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertCompany
You can execute the `UpsertCompany` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertCompany(options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertCompany(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;
```

### Variables
The `UpsertCompany` Mutation requires an argument of type `UpsertCompanyVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertCompany` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertCompany` Mutation is of type `UpsertCompanyData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertCompanyData {
  company_insert: Company_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertCompany`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertCompanyVariables } from '@skillsetu/dataconnect';
import { useUpsertCompany } from '@skillsetu/dataconnect/react'

export default function UpsertCompanyComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertCompany();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertCompany(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompany(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompany(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertCompany` Mutation requires an argument of type `UpsertCompanyVariables`:
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
  mutation.mutate(upsertCompanyVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., type: ..., industry: ..., location: ..., coordinates: ..., employees: ..., founded: ..., website: ..., tagline: ..., about: ..., mission: ..., techStack: ..., departments: ..., hiringDomains: ..., benefits: ..., culture: ..., logo: ..., coverImage: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertCompanyVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.company_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateMyCompany
You can execute the `UpdateMyCompany` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateMyCompany(options?: useDataConnectMutationOptions<UpdateMyCompanyData, FirebaseError, UpdateMyCompanyVariables>): UseDataConnectMutationResult<UpdateMyCompanyData, UpdateMyCompanyVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateMyCompany(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyCompanyData, FirebaseError, UpdateMyCompanyVariables>): UseDataConnectMutationResult<UpdateMyCompanyData, UpdateMyCompanyVariables>;
```

### Variables
The `UpdateMyCompany` Mutation requires an argument of type `UpdateMyCompanyVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateMyCompany` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateMyCompany` Mutation is of type `UpdateMyCompanyData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateMyCompanyData {
  company_update?: Company_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateMyCompany`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateMyCompanyVariables } from '@skillsetu/dataconnect';
import { useUpdateMyCompany } from '@skillsetu/dataconnect/react'

export default function UpdateMyCompanyComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateMyCompany();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateMyCompany(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyCompany(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyCompany(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateMyCompany` Mutation requires an argument of type `UpdateMyCompanyVariables`:
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
  mutation.mutate(updateMyCompanyVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., industry: ..., employees: ..., location: ..., website: ..., about: ..., mission: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateMyCompanyVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.company_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertCollege
You can execute the `UpsertCollege` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertCollege(options?: useDataConnectMutationOptions<UpsertCollegeData, FirebaseError, UpsertCollegeVariables>): UseDataConnectMutationResult<UpsertCollegeData, UpsertCollegeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertCollege(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCollegeData, FirebaseError, UpsertCollegeVariables>): UseDataConnectMutationResult<UpsertCollegeData, UpsertCollegeVariables>;
```

### Variables
The `UpsertCollege` Mutation requires an argument of type `UpsertCollegeVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertCollege` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertCollege` Mutation is of type `UpsertCollegeData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertCollegeData {
  college_insert: College_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertCollege`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertCollegeVariables } from '@skillsetu/dataconnect';
import { useUpsertCollege } from '@skillsetu/dataconnect/react'

export default function UpsertCollegeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertCollege();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertCollege(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCollege(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCollege(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertCollege` Mutation requires an argument of type `UpsertCollegeVariables`:
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
  mutation.mutate(upsertCollegeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., location: ..., coordinates: ..., studentsCount: ..., verifiedStudentsCount: ..., placementReadiness: ..., contactPerson: ..., contactEmail: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertCollegeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.college_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateMyCollege
You can execute the `CreateMyCollege` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateMyCollege(options?: useDataConnectMutationOptions<CreateMyCollegeData, FirebaseError, CreateMyCollegeVariables>): UseDataConnectMutationResult<CreateMyCollegeData, CreateMyCollegeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateMyCollege(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMyCollegeData, FirebaseError, CreateMyCollegeVariables>): UseDataConnectMutationResult<CreateMyCollegeData, CreateMyCollegeVariables>;
```

### Variables
The `CreateMyCollege` Mutation requires an argument of type `CreateMyCollegeVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateMyCollegeVariables {
  name: string;
  location?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}
```
### Return Type
Recall that calling the `CreateMyCollege` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateMyCollege` Mutation is of type `CreateMyCollegeData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateMyCollegeData {
  college_insert: College_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateMyCollege`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateMyCollegeVariables } from '@skillsetu/dataconnect';
import { useCreateMyCollege } from '@skillsetu/dataconnect/react'

export default function CreateMyCollegeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateMyCollege();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateMyCollege(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateMyCollege(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateMyCollege(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateMyCollege` Mutation requires an argument of type `CreateMyCollegeVariables`:
  const createMyCollegeVars: CreateMyCollegeVariables = {
    name: ..., 
    location: ..., // optional
    contactPerson: ..., // optional
    contactEmail: ..., // optional
  };
  mutation.mutate(createMyCollegeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., location: ..., contactPerson: ..., contactEmail: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createMyCollegeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.college_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateMyCollege
You can execute the `UpdateMyCollege` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateMyCollege(options?: useDataConnectMutationOptions<UpdateMyCollegeData, FirebaseError, UpdateMyCollegeVariables>): UseDataConnectMutationResult<UpdateMyCollegeData, UpdateMyCollegeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateMyCollege(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyCollegeData, FirebaseError, UpdateMyCollegeVariables>): UseDataConnectMutationResult<UpdateMyCollegeData, UpdateMyCollegeVariables>;
```

### Variables
The `UpdateMyCollege` Mutation requires an argument of type `UpdateMyCollegeVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateMyCollegeVariables {
  id: UUIDString;
  name: string;
  location?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}
```
### Return Type
Recall that calling the `UpdateMyCollege` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateMyCollege` Mutation is of type `UpdateMyCollegeData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateMyCollegeData {
  college_update?: College_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateMyCollege`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateMyCollegeVariables } from '@skillsetu/dataconnect';
import { useUpdateMyCollege } from '@skillsetu/dataconnect/react'

export default function UpdateMyCollegeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateMyCollege();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateMyCollege(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyCollege(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyCollege(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateMyCollege` Mutation requires an argument of type `UpdateMyCollegeVariables`:
  const updateMyCollegeVars: UpdateMyCollegeVariables = {
    id: ..., 
    name: ..., 
    location: ..., // optional
    contactPerson: ..., // optional
    contactEmail: ..., // optional
  };
  mutation.mutate(updateMyCollegeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., location: ..., contactPerson: ..., contactEmail: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateMyCollegeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.college_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateSkill
You can execute the `CreateSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateSkill(options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateSkill(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;
```

### Variables
The `CreateSkill` Mutation requires an argument of type `CreateSkillVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateSkillVariables {
  name: string;
  category?: string | null;
  description?: string | null;
}
```
### Return Type
Recall that calling the `CreateSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateSkill` Mutation is of type `CreateSkillData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateSkillData {
  skill_insert: Skill_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateSkillVariables } from '@skillsetu/dataconnect';
import { useCreateSkill } from '@skillsetu/dataconnect/react'

export default function CreateSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateSkill` Mutation requires an argument of type `CreateSkillVariables`:
  const createSkillVars: CreateSkillVariables = {
    name: ..., 
    category: ..., // optional
    description: ..., // optional
  };
  mutation.mutate(createSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., category: ..., description: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.skill_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertUserSkill
You can execute the `UpsertUserSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUserSkill(options?: useDataConnectMutationOptions<UpsertUserSkillData, FirebaseError, UpsertUserSkillVariables>): UseDataConnectMutationResult<UpsertUserSkillData, UpsertUserSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUserSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserSkillData, FirebaseError, UpsertUserSkillVariables>): UseDataConnectMutationResult<UpsertUserSkillData, UpsertUserSkillVariables>;
```

### Variables
The `UpsertUserSkill` Mutation requires an argument of type `UpsertUserSkillVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertUserSkillVariables {
  skillId: UUIDString;
  level: SkillLevel;
}
```
### Return Type
Recall that calling the `UpsertUserSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertUserSkill` Mutation is of type `UpsertUserSkillData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserSkillData {
  userSkill_upsert: UserSkill_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertUserSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserSkillVariables } from '@skillsetu/dataconnect';
import { useUpsertUserSkill } from '@skillsetu/dataconnect/react'

export default function UpsertUserSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUserSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUserSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUserSkill` Mutation requires an argument of type `UpsertUserSkillVariables`:
  const upsertUserSkillVars: UpsertUserSkillVariables = {
    skillId: ..., 
    level: ..., 
  };
  mutation.mutate(upsertUserSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ skillId: ..., level: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUserSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userSkill_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateCandidateProject
You can execute the `CreateCandidateProject` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateCandidateProject(options?: useDataConnectMutationOptions<CreateCandidateProjectData, FirebaseError, CreateCandidateProjectVariables>): UseDataConnectMutationResult<CreateCandidateProjectData, CreateCandidateProjectVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateCandidateProject(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCandidateProjectData, FirebaseError, CreateCandidateProjectVariables>): UseDataConnectMutationResult<CreateCandidateProjectData, CreateCandidateProjectVariables>;
```

### Variables
The `CreateCandidateProject` Mutation requires an argument of type `CreateCandidateProjectVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateCandidateProjectVariables {
  title: string;
  description?: string | null;
  technologies?: string[] | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
}
```
### Return Type
Recall that calling the `CreateCandidateProject` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateCandidateProject` Mutation is of type `CreateCandidateProjectData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCandidateProjectData {
  candidateProject_insert: CandidateProject_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateCandidateProject`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCandidateProjectVariables } from '@skillsetu/dataconnect';
import { useCreateCandidateProject } from '@skillsetu/dataconnect/react'

export default function CreateCandidateProjectComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateCandidateProject();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateCandidateProject(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCandidateProject(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCandidateProject(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateCandidateProject` Mutation requires an argument of type `CreateCandidateProjectVariables`:
  const createCandidateProjectVars: CreateCandidateProjectVariables = {
    title: ..., 
    description: ..., // optional
    technologies: ..., // optional
    githubUrl: ..., // optional
    liveUrl: ..., // optional
  };
  mutation.mutate(createCandidateProjectVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., description: ..., technologies: ..., githubUrl: ..., liveUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCandidateProjectVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.candidateProject_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateCandidateExperience
You can execute the `CreateCandidateExperience` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateCandidateExperience(options?: useDataConnectMutationOptions<CreateCandidateExperienceData, FirebaseError, CreateCandidateExperienceVariables>): UseDataConnectMutationResult<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateCandidateExperience(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCandidateExperienceData, FirebaseError, CreateCandidateExperienceVariables>): UseDataConnectMutationResult<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
```

### Variables
The `CreateCandidateExperience` Mutation requires an argument of type `CreateCandidateExperienceVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateCandidateExperience` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateCandidateExperience` Mutation is of type `CreateCandidateExperienceData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCandidateExperienceData {
  candidateExperience_insert: CandidateExperience_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateCandidateExperience`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCandidateExperienceVariables } from '@skillsetu/dataconnect';
import { useCreateCandidateExperience } from '@skillsetu/dataconnect/react'

export default function CreateCandidateExperienceComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateCandidateExperience();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateCandidateExperience(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCandidateExperience(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCandidateExperience(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateCandidateExperience` Mutation requires an argument of type `CreateCandidateExperienceVariables`:
  const createCandidateExperienceVars: CreateCandidateExperienceVariables = {
    title: ..., 
    company: ..., 
    duration: ..., // optional
    description: ..., // optional
    location: ..., // optional
    startDate: ..., // optional
    endDate: ..., // optional
  };
  mutation.mutate(createCandidateExperienceVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., company: ..., duration: ..., description: ..., location: ..., startDate: ..., endDate: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCandidateExperienceVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.candidateExperience_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateCandidateEducation
You can execute the `CreateCandidateEducation` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateCandidateEducation(options?: useDataConnectMutationOptions<CreateCandidateEducationData, FirebaseError, CreateCandidateEducationVariables>): UseDataConnectMutationResult<CreateCandidateEducationData, CreateCandidateEducationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateCandidateEducation(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCandidateEducationData, FirebaseError, CreateCandidateEducationVariables>): UseDataConnectMutationResult<CreateCandidateEducationData, CreateCandidateEducationVariables>;
```

### Variables
The `CreateCandidateEducation` Mutation requires an argument of type `CreateCandidateEducationVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateCandidateEducation` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateCandidateEducation` Mutation is of type `CreateCandidateEducationData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCandidateEducationData {
  candidateEducation_insert: CandidateEducation_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateCandidateEducation`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCandidateEducationVariables } from '@skillsetu/dataconnect';
import { useCreateCandidateEducation } from '@skillsetu/dataconnect/react'

export default function CreateCandidateEducationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateCandidateEducation();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateCandidateEducation(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCandidateEducation(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCandidateEducation(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateCandidateEducation` Mutation requires an argument of type `CreateCandidateEducationVariables`:
  const createCandidateEducationVars: CreateCandidateEducationVariables = {
    degree: ..., 
    department: ..., 
    college: ..., 
    graduationYear: ..., // optional
    cgpa: ..., // optional
    currentYear: ..., // optional
  };
  mutation.mutate(createCandidateEducationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCandidateEducationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.candidateEducation_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateProfileEducation
You can execute the `CreateProfileEducation` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateProfileEducation(options?: useDataConnectMutationOptions<CreateProfileEducationData, FirebaseError, CreateProfileEducationVariables>): UseDataConnectMutationResult<CreateProfileEducationData, CreateProfileEducationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateProfileEducation(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProfileEducationData, FirebaseError, CreateProfileEducationVariables>): UseDataConnectMutationResult<CreateProfileEducationData, CreateProfileEducationVariables>;
```

### Variables
The `CreateProfileEducation` Mutation requires an argument of type `CreateProfileEducationVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateProfileEducation` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateProfileEducation` Mutation is of type `CreateProfileEducationData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateProfileEducationData {
  candidateEducation_insert: CandidateEducation_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateProfileEducation`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateProfileEducationVariables } from '@skillsetu/dataconnect';
import { useCreateProfileEducation } from '@skillsetu/dataconnect/react'

export default function CreateProfileEducationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateProfileEducation();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateProfileEducation(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateProfileEducation(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateProfileEducation(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateProfileEducation` Mutation requires an argument of type `CreateProfileEducationVariables`:
  const createProfileEducationVars: CreateProfileEducationVariables = {
    degree: ..., 
    department: ..., 
    college: ..., 
    graduationYear: ..., // optional
    cgpa: ..., // optional
    currentYear: ..., // optional
  };
  mutation.mutate(createProfileEducationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createProfileEducationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.candidateEducation_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateMyProfileEducation
You can execute the `UpdateMyProfileEducation` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateMyProfileEducation(options?: useDataConnectMutationOptions<UpdateMyProfileEducationData, FirebaseError, UpdateMyProfileEducationVariables>): UseDataConnectMutationResult<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateMyProfileEducation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyProfileEducationData, FirebaseError, UpdateMyProfileEducationVariables>): UseDataConnectMutationResult<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
```

### Variables
The `UpdateMyProfileEducation` Mutation requires an argument of type `UpdateMyProfileEducationVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateMyProfileEducation` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateMyProfileEducation` Mutation is of type `UpdateMyProfileEducationData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateMyProfileEducationData {
  candidateEducation_update?: CandidateEducation_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateMyProfileEducation`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateMyProfileEducationVariables } from '@skillsetu/dataconnect';
import { useUpdateMyProfileEducation } from '@skillsetu/dataconnect/react'

export default function UpdateMyProfileEducationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateMyProfileEducation();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateMyProfileEducation(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyProfileEducation(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyProfileEducation(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateMyProfileEducation` Mutation requires an argument of type `UpdateMyProfileEducationVariables`:
  const updateMyProfileEducationVars: UpdateMyProfileEducationVariables = {
    id: ..., 
    degree: ..., 
    department: ..., 
    college: ..., 
    graduationYear: ..., // optional
    cgpa: ..., // optional
    currentYear: ..., // optional
  };
  mutation.mutate(updateMyProfileEducationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., degree: ..., department: ..., college: ..., graduationYear: ..., cgpa: ..., currentYear: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateMyProfileEducationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.candidateEducation_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteMyDuplicateEducation
You can execute the `DeleteMyDuplicateEducation` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteMyDuplicateEducation(options?: useDataConnectMutationOptions<DeleteMyDuplicateEducationData, FirebaseError, DeleteMyDuplicateEducationVariables>): UseDataConnectMutationResult<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteMyDuplicateEducation(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMyDuplicateEducationData, FirebaseError, DeleteMyDuplicateEducationVariables>): UseDataConnectMutationResult<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
```

### Variables
The `DeleteMyDuplicateEducation` Mutation requires an argument of type `DeleteMyDuplicateEducationVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteMyDuplicateEducationVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteMyDuplicateEducation` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteMyDuplicateEducation` Mutation is of type `DeleteMyDuplicateEducationData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteMyDuplicateEducationData {
  candidateEducation_delete?: CandidateEducation_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteMyDuplicateEducation`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteMyDuplicateEducationVariables } from '@skillsetu/dataconnect';
import { useDeleteMyDuplicateEducation } from '@skillsetu/dataconnect/react'

export default function DeleteMyDuplicateEducationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteMyDuplicateEducation();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteMyDuplicateEducation(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteMyDuplicateEducation(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteMyDuplicateEducation(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteMyDuplicateEducation` Mutation requires an argument of type `DeleteMyDuplicateEducationVariables`:
  const deleteMyDuplicateEducationVars: DeleteMyDuplicateEducationVariables = {
    id: ..., 
  };
  mutation.mutate(deleteMyDuplicateEducationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteMyDuplicateEducationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.candidateEducation_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateJob
You can execute the `CreateJob` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateJob(options?: useDataConnectMutationOptions<CreateJobData, FirebaseError, CreateJobVariables>): UseDataConnectMutationResult<CreateJobData, CreateJobVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateJob(dc: DataConnect, options?: useDataConnectMutationOptions<CreateJobData, FirebaseError, CreateJobVariables>): UseDataConnectMutationResult<CreateJobData, CreateJobVariables>;
```

### Variables
The `CreateJob` Mutation requires an argument of type `CreateJobVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateJob` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateJob` Mutation is of type `CreateJobData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateJobData {
  job_insert: Job_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateJob`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateJobVariables } from '@skillsetu/dataconnect';
import { useCreateJob } from '@skillsetu/dataconnect/react'

export default function CreateJobComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateJob();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateJob(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateJob(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateJob(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateJob` Mutation requires an argument of type `CreateJobVariables`:
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
  mutation.mutate(createJobVars);
  // Variables can be defined inline as well.
  mutation.mutate({ companyId: ..., title: ..., department: ..., location: ..., workMode: ..., jobType: ..., salaryRange: ..., experienceRequired: ..., education: ..., graduationYear: ..., minimumCgpa: ..., description: ..., responsibilities: ..., qualifications: ..., deadline: ..., openings: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createJobVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.job_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertJobRequiredSkill
You can execute the `UpsertJobRequiredSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertJobRequiredSkill(options?: useDataConnectMutationOptions<UpsertJobRequiredSkillData, FirebaseError, UpsertJobRequiredSkillVariables>): UseDataConnectMutationResult<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertJobRequiredSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertJobRequiredSkillData, FirebaseError, UpsertJobRequiredSkillVariables>): UseDataConnectMutationResult<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
```

### Variables
The `UpsertJobRequiredSkill` Mutation requires an argument of type `UpsertJobRequiredSkillVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertJobRequiredSkillVariables {
  jobId: UUIDString;
  skillId: UUIDString;
  level: SkillLevel;
  importance: SkillImportance;
  minScore?: number | null;
}
```
### Return Type
Recall that calling the `UpsertJobRequiredSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertJobRequiredSkill` Mutation is of type `UpsertJobRequiredSkillData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertJobRequiredSkillData {
  jobRequiredSkill_upsert: JobRequiredSkill_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertJobRequiredSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertJobRequiredSkillVariables } from '@skillsetu/dataconnect';
import { useUpsertJobRequiredSkill } from '@skillsetu/dataconnect/react'

export default function UpsertJobRequiredSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertJobRequiredSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertJobRequiredSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertJobRequiredSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertJobRequiredSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertJobRequiredSkill` Mutation requires an argument of type `UpsertJobRequiredSkillVariables`:
  const upsertJobRequiredSkillVars: UpsertJobRequiredSkillVariables = {
    jobId: ..., 
    skillId: ..., 
    level: ..., 
    importance: ..., 
    minScore: ..., // optional
  };
  mutation.mutate(upsertJobRequiredSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ jobId: ..., skillId: ..., level: ..., importance: ..., minScore: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertJobRequiredSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.jobRequiredSkill_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateInternship
You can execute the `CreateInternship` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateInternship(options?: useDataConnectMutationOptions<CreateInternshipData, FirebaseError, CreateInternshipVariables>): UseDataConnectMutationResult<CreateInternshipData, CreateInternshipVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateInternship(dc: DataConnect, options?: useDataConnectMutationOptions<CreateInternshipData, FirebaseError, CreateInternshipVariables>): UseDataConnectMutationResult<CreateInternshipData, CreateInternshipVariables>;
```

### Variables
The `CreateInternship` Mutation requires an argument of type `CreateInternshipVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateInternship` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateInternship` Mutation is of type `CreateInternshipData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateInternshipData {
  internship_insert: Internship_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateInternship`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateInternshipVariables } from '@skillsetu/dataconnect';
import { useCreateInternship } from '@skillsetu/dataconnect/react'

export default function CreateInternshipComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateInternship();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateInternship(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateInternship(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateInternship(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateInternship` Mutation requires an argument of type `CreateInternshipVariables`:
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
  mutation.mutate(createInternshipVars);
  // Variables can be defined inline as well.
  mutation.mutate({ companyId: ..., title: ..., department: ..., location: ..., workMode: ..., duration: ..., stipend: ..., eligibility: ..., startDate: ..., applicationDeadline: ..., description: ..., learningOutcomes: ..., mentor: ..., openings: ..., isStartupFriendly: ..., targetAudience: ..., eligibleForConversion: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createInternshipVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.internship_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertInternshipRequiredSkill
You can execute the `UpsertInternshipRequiredSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertInternshipRequiredSkill(options?: useDataConnectMutationOptions<UpsertInternshipRequiredSkillData, FirebaseError, UpsertInternshipRequiredSkillVariables>): UseDataConnectMutationResult<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertInternshipRequiredSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertInternshipRequiredSkillData, FirebaseError, UpsertInternshipRequiredSkillVariables>): UseDataConnectMutationResult<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
```

### Variables
The `UpsertInternshipRequiredSkill` Mutation requires an argument of type `UpsertInternshipRequiredSkillVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertInternshipRequiredSkillVariables {
  internshipId: UUIDString;
  skillId: UUIDString;
  level: SkillLevel;
  importance: SkillImportance;
  minScore?: number | null;
}
```
### Return Type
Recall that calling the `UpsertInternshipRequiredSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertInternshipRequiredSkill` Mutation is of type `UpsertInternshipRequiredSkillData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertInternshipRequiredSkillData {
  internshipRequiredSkill_upsert: InternshipRequiredSkill_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertInternshipRequiredSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertInternshipRequiredSkillVariables } from '@skillsetu/dataconnect';
import { useUpsertInternshipRequiredSkill } from '@skillsetu/dataconnect/react'

export default function UpsertInternshipRequiredSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertInternshipRequiredSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertInternshipRequiredSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertInternshipRequiredSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertInternshipRequiredSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertInternshipRequiredSkill` Mutation requires an argument of type `UpsertInternshipRequiredSkillVariables`:
  const upsertInternshipRequiredSkillVars: UpsertInternshipRequiredSkillVariables = {
    internshipId: ..., 
    skillId: ..., 
    level: ..., 
    importance: ..., 
    minScore: ..., // optional
  };
  mutation.mutate(upsertInternshipRequiredSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ internshipId: ..., skillId: ..., level: ..., importance: ..., minScore: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertInternshipRequiredSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.internshipRequiredSkill_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateApplication
You can execute the `CreateApplication` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateApplication(options?: useDataConnectMutationOptions<CreateApplicationData, FirebaseError, CreateApplicationVariables>): UseDataConnectMutationResult<CreateApplicationData, CreateApplicationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateApplication(dc: DataConnect, options?: useDataConnectMutationOptions<CreateApplicationData, FirebaseError, CreateApplicationVariables>): UseDataConnectMutationResult<CreateApplicationData, CreateApplicationVariables>;
```

### Variables
The `CreateApplication` Mutation requires an argument of type `CreateApplicationVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateApplication` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateApplication` Mutation is of type `CreateApplicationData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateApplicationData {
  application_insert: Application_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateApplication`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateApplicationVariables } from '@skillsetu/dataconnect';
import { useCreateApplication } from '@skillsetu/dataconnect/react'

export default function CreateApplicationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateApplication();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateApplication(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateApplication(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateApplication(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateApplication` Mutation requires an argument of type `CreateApplicationVariables`:
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
  mutation.mutate(createApplicationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ companyId: ..., opportunityId: ..., opportunityType: ..., jobId: ..., internshipId: ..., opportunityKey: ..., title: ..., jobType: ..., matchScore: ..., matchedSkills: ..., missingSkills: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createApplicationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.application_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateApplicationStage
You can execute the `UpdateApplicationStage` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateApplicationStage(options?: useDataConnectMutationOptions<UpdateApplicationStageData, FirebaseError, UpdateApplicationStageVariables>): UseDataConnectMutationResult<UpdateApplicationStageData, UpdateApplicationStageVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateApplicationStage(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateApplicationStageData, FirebaseError, UpdateApplicationStageVariables>): UseDataConnectMutationResult<UpdateApplicationStageData, UpdateApplicationStageVariables>;
```

### Variables
The `UpdateApplicationStage` Mutation requires an argument of type `UpdateApplicationStageVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateApplicationStageVariables {
  id: UUIDString;
  stage: ApplicationStage;
  note?: string | null;
}
```
### Return Type
Recall that calling the `UpdateApplicationStage` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateApplicationStage` Mutation is of type `UpdateApplicationStageData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateApplicationStageData {
  application_update?: Application_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateApplicationStage`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateApplicationStageVariables } from '@skillsetu/dataconnect';
import { useUpdateApplicationStage } from '@skillsetu/dataconnect/react'

export default function UpdateApplicationStageComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateApplicationStage();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateApplicationStage(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateApplicationStage(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateApplicationStage(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateApplicationStage` Mutation requires an argument of type `UpdateApplicationStageVariables`:
  const updateApplicationStageVars: UpdateApplicationStageVariables = {
    id: ..., 
    stage: ..., 
    note: ..., // optional
  };
  mutation.mutate(updateApplicationStageVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., stage: ..., note: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateApplicationStageVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.application_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateInterview
You can execute the `CreateInterview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateInterview(options?: useDataConnectMutationOptions<CreateInterviewData, FirebaseError, CreateInterviewVariables>): UseDataConnectMutationResult<CreateInterviewData, CreateInterviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateInterview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateInterviewData, FirebaseError, CreateInterviewVariables>): UseDataConnectMutationResult<CreateInterviewData, CreateInterviewVariables>;
```

### Variables
The `CreateInterview` Mutation requires an argument of type `CreateInterviewVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateInterview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateInterview` Mutation is of type `CreateInterviewData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateInterviewData {
  interview_insert: Interview_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateInterview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateInterviewVariables } from '@skillsetu/dataconnect';
import { useCreateInterview } from '@skillsetu/dataconnect/react'

export default function CreateInterviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateInterview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateInterview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateInterview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateInterview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateInterview` Mutation requires an argument of type `CreateInterviewVariables`:
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
  mutation.mutate(createInterviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ candidateUid: ..., companyId: ..., title: ..., round: ..., date: ..., time: ..., mode: ..., meetingLink: ..., interviewers: ..., notes: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createInterviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.interview_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateChallenge
You can execute the `CreateChallenge` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateChallenge(options?: useDataConnectMutationOptions<CreateChallengeData, FirebaseError, CreateChallengeVariables>): UseDataConnectMutationResult<CreateChallengeData, CreateChallengeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateChallenge(dc: DataConnect, options?: useDataConnectMutationOptions<CreateChallengeData, FirebaseError, CreateChallengeVariables>): UseDataConnectMutationResult<CreateChallengeData, CreateChallengeVariables>;
```

### Variables
The `CreateChallenge` Mutation requires an argument of type `CreateChallengeVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateChallenge` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateChallenge` Mutation is of type `CreateChallengeData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateChallengeData {
  challenge_insert: Challenge_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateChallenge`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateChallengeVariables } from '@skillsetu/dataconnect';
import { useCreateChallenge } from '@skillsetu/dataconnect/react'

export default function CreateChallengeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateChallenge();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateChallenge(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateChallenge(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateChallenge(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateChallenge` Mutation requires an argument of type `CreateChallengeVariables`:
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
  mutation.mutate(createChallengeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ companyId: ..., title: ..., description: ..., problemStatement: ..., requiredSkills: ..., difficulty: ..., deadline: ..., teamSize: ..., prize: ..., submissionRequirements: ..., collegeParticipation: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createChallengeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.challenge_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateChallengeSubmission
You can execute the `CreateChallengeSubmission` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateChallengeSubmission(options?: useDataConnectMutationOptions<CreateChallengeSubmissionData, FirebaseError, CreateChallengeSubmissionVariables>): UseDataConnectMutationResult<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateChallengeSubmission(dc: DataConnect, options?: useDataConnectMutationOptions<CreateChallengeSubmissionData, FirebaseError, CreateChallengeSubmissionVariables>): UseDataConnectMutationResult<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
```

### Variables
The `CreateChallengeSubmission` Mutation requires an argument of type `CreateChallengeSubmissionVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateChallengeSubmission` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateChallengeSubmission` Mutation is of type `CreateChallengeSubmissionData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateChallengeSubmissionData {
  challengeSubmission_insert: ChallengeSubmission_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateChallengeSubmission`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateChallengeSubmissionVariables } from '@skillsetu/dataconnect';
import { useCreateChallengeSubmission } from '@skillsetu/dataconnect/react'

export default function CreateChallengeSubmissionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateChallengeSubmission();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateChallengeSubmission(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateChallengeSubmission(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateChallengeSubmission(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateChallengeSubmission` Mutation requires an argument of type `CreateChallengeSubmissionVariables`:
  const createChallengeSubmissionVars: CreateChallengeSubmissionVariables = {
    challengeId: ..., 
    teamName: ..., 
    githubUrl: ..., 
    liveDemoUrl: ..., // optional
    videoUrl: ..., // optional
    skillsDemonstrated: ..., // optional
  };
  mutation.mutate(createChallengeSubmissionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ challengeId: ..., teamName: ..., githubUrl: ..., liveDemoUrl: ..., videoUrl: ..., skillsDemonstrated: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createChallengeSubmissionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.challengeSubmission_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateOffer
You can execute the `CreateOffer` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateOffer(options?: useDataConnectMutationOptions<CreateOfferData, FirebaseError, CreateOfferVariables>): UseDataConnectMutationResult<CreateOfferData, CreateOfferVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateOffer(dc: DataConnect, options?: useDataConnectMutationOptions<CreateOfferData, FirebaseError, CreateOfferVariables>): UseDataConnectMutationResult<CreateOfferData, CreateOfferVariables>;
```

### Variables
The `CreateOffer` Mutation requires an argument of type `CreateOfferVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateOffer` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateOffer` Mutation is of type `CreateOfferData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateOfferData {
  offer_insert: Offer_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateOffer`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateOfferVariables } from '@skillsetu/dataconnect';
import { useCreateOffer } from '@skillsetu/dataconnect/react'

export default function CreateOfferComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateOffer();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateOffer(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateOffer(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateOffer(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateOffer` Mutation requires an argument of type `CreateOfferVariables`:
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
  mutation.mutate(createOfferVars);
  // Variables can be defined inline as well.
  mutation.mutate({ candidateUid: ..., companyId: ..., jobOrInternshipId: ..., roleTitle: ..., type: ..., department: ..., location: ..., workMode: ..., compensation: ..., baseFixed: ..., variableBonus: ..., retentionJoiningBonus: ..., benefitsSummary: ..., joiningDate: ..., validUntil: ..., status: ..., authorizedSignatory: ..., signatoryTitle: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createOfferVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.offer_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateCurriculumModule
You can execute the `CreateCurriculumModule` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useCreateCurriculumModule(options?: useDataConnectMutationOptions<CreateCurriculumModuleData, FirebaseError, CreateCurriculumModuleVariables>): UseDataConnectMutationResult<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateCurriculumModule(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCurriculumModuleData, FirebaseError, CreateCurriculumModuleVariables>): UseDataConnectMutationResult<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
```

### Variables
The `CreateCurriculumModule` Mutation requires an argument of type `CreateCurriculumModuleVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateCurriculumModule` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateCurriculumModule` Mutation is of type `CreateCurriculumModuleData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCurriculumModuleData {
  curriculumModule_insert: CurriculumModule_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateCurriculumModule`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCurriculumModuleVariables } from '@skillsetu/dataconnect';
import { useCreateCurriculumModule } from '@skillsetu/dataconnect/react'

export default function CreateCurriculumModuleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateCurriculumModule();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateCurriculumModule(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCurriculumModule(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCurriculumModule(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateCurriculumModule` Mutation requires an argument of type `CreateCurriculumModuleVariables`:
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
  mutation.mutate(createCurriculumModuleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ collegeCompanyCollegeId: ..., collegeCompanyCompanyId: ..., semester: ..., currentSubject: ..., industryRecommendation: ..., recommendedTechnologies: ..., rationale: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCurriculumModuleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.curriculumModule_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertHiringPreferences
You can execute the `UpsertHiringPreferences` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertHiringPreferences(options?: useDataConnectMutationOptions<UpsertHiringPreferencesData, FirebaseError, UpsertHiringPreferencesVariables>): UseDataConnectMutationResult<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertHiringPreferences(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertHiringPreferencesData, FirebaseError, UpsertHiringPreferencesVariables>): UseDataConnectMutationResult<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
```

### Variables
The `UpsertHiringPreferences` Mutation requires an argument of type `UpsertHiringPreferencesVariables`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertHiringPreferences` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertHiringPreferences` Mutation is of type `UpsertHiringPreferencesData`, which is defined in [dataconnect/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertHiringPreferencesData {
  hiringPreferences_upsert: HiringPreferences_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertHiringPreferences`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertHiringPreferencesVariables } from '@skillsetu/dataconnect';
import { useUpsertHiringPreferences } from '@skillsetu/dataconnect/react'

export default function UpsertHiringPreferencesComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertHiringPreferences();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertHiringPreferences(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertHiringPreferences(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertHiringPreferences(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertHiringPreferences` Mutation requires an argument of type `UpsertHiringPreferencesVariables`:
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
  mutation.mutate(upsertHiringPreferencesVars);
  // Variables can be defined inline as well.
  mutation.mutate({ companyId: ..., preferredDepartments: ..., preferredDegrees: ..., preferredGraduationYears: ..., preferredLocations: ..., workModes: ..., minimumCgpa: ..., prioritizeVerifiedSkills: ..., prioritizeStartupExperience: ..., searchRadiusKm: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertHiringPreferencesVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.hiringPreferences_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

