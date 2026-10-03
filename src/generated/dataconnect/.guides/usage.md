# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertStudentProfile, useUpsertUserProfile, useUpsertCompany, useUpdateMyCompany, useUpsertCollege, useCreateMyCollege, useUpdateMyCollege, useCreateSkill, useUpsertUserSkill, useCreateCandidateProject } from '@skillsetu/dataconnect/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertStudentProfile(upsertStudentProfileVars);

const { data, isPending, isSuccess, isError, error } = useUpsertUserProfile(upsertUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useUpsertCompany(upsertCompanyVars);

const { data, isPending, isSuccess, isError, error } = useUpdateMyCompany(updateMyCompanyVars);

const { data, isPending, isSuccess, isError, error } = useUpsertCollege(upsertCollegeVars);

const { data, isPending, isSuccess, isError, error } = useCreateMyCollege(createMyCollegeVars);

const { data, isPending, isSuccess, isError, error } = useUpdateMyCollege(updateMyCollegeVars);

const { data, isPending, isSuccess, isError, error } = useCreateSkill(createSkillVars);

const { data, isPending, isSuccess, isError, error } = useUpsertUserSkill(upsertUserSkillVars);

const { data, isPending, isSuccess, isError, error } = useCreateCandidateProject(createCandidateProjectVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertStudentProfile, upsertUserProfile, upsertCompany, updateMyCompany, upsertCollege, createMyCollege, updateMyCollege, createSkill, upsertUserSkill, createCandidateProject } from '@skillsetu/dataconnect';


// Operation UpsertStudentProfile:  For variables, look at type UpsertStudentProfileVars in ../index.d.ts
const { data } = await UpsertStudentProfile(dataConnect, upsertStudentProfileVars);

// Operation UpsertUserProfile:  For variables, look at type UpsertUserProfileVars in ../index.d.ts
const { data } = await UpsertUserProfile(dataConnect, upsertUserProfileVars);

// Operation UpsertCompany:  For variables, look at type UpsertCompanyVars in ../index.d.ts
const { data } = await UpsertCompany(dataConnect, upsertCompanyVars);

// Operation UpdateMyCompany:  For variables, look at type UpdateMyCompanyVars in ../index.d.ts
const { data } = await UpdateMyCompany(dataConnect, updateMyCompanyVars);

// Operation UpsertCollege:  For variables, look at type UpsertCollegeVars in ../index.d.ts
const { data } = await UpsertCollege(dataConnect, upsertCollegeVars);

// Operation CreateMyCollege:  For variables, look at type CreateMyCollegeVars in ../index.d.ts
const { data } = await CreateMyCollege(dataConnect, createMyCollegeVars);

// Operation UpdateMyCollege:  For variables, look at type UpdateMyCollegeVars in ../index.d.ts
const { data } = await UpdateMyCollege(dataConnect, updateMyCollegeVars);

// Operation CreateSkill:  For variables, look at type CreateSkillVars in ../index.d.ts
const { data } = await CreateSkill(dataConnect, createSkillVars);

// Operation UpsertUserSkill:  For variables, look at type UpsertUserSkillVars in ../index.d.ts
const { data } = await UpsertUserSkill(dataConnect, upsertUserSkillVars);

// Operation CreateCandidateProject:  For variables, look at type CreateCandidateProjectVars in ../index.d.ts
const { data } = await CreateCandidateProject(dataConnect, createCandidateProjectVars);


```