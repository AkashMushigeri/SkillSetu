type EducationRow = {
  id: string;
  profileOwnerUid?: string | null;
  degree: string;
  department: string;
  college: string;
  graduationYear?: number | null;
  cgpa?: number | null;
  currentYear?: string | null;
  createdAt: string;
};

const sameSchool = (a: EducationRow, b: Pick<EducationRow, 'degree' | 'college'>) =>
  a.degree.trim().toLowerCase() === b.degree.trim().toLowerCase()
  && a.college.trim().toLowerCase() === b.college.trim().toLowerCase();

export function selectProfileEducation(rows: EducationRow[], uid: string, profile: Pick<EducationRow, 'degree' | 'college'>) {
  return rows.find((row) => row.profileOwnerUid === uid)
    || rows.filter((row) => !row.profileOwnerUid && sameSchool(row, profile))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

export function exactDuplicateEducationIds(rows: EducationRow[], selected: EducationRow | undefined) {
  if (!selected) return [];
  return rows.filter((row) => row.id !== selected.id && !row.profileOwnerUid
    && row.degree === selected.degree
    && row.department === selected.department
    && row.college === selected.college
    && (row.graduationYear ?? null) === (selected.graduationYear ?? null)
    && (row.cgpa ?? null) === (selected.cgpa ?? null)
    && (row.currentYear ?? null) === (selected.currentYear ?? null)
  ).map((row) => row.id);
}
