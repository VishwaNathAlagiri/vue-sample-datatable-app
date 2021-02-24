const computeMixin = {
  methods: {
    calculateSalary(item) {
      const { salaryForQ1, salaryForQ2, salaryForQ3, salaryForQ4, workingHoursQ1, workingHoursQ2, workingHoursQ3, workingHoursQ4 } = item;

      this.displayColoum = true;
      if (this.q1 && this.q2 && this.q3 && this.q4) {
        this.totalSalaryOf = `Q1+Q2+Q3+Q4`;
        return {
          totalSalary: salaryForQ1 + salaryForQ2 + salaryForQ3 + salaryForQ4,
          totalWorkingHours: workingHoursQ1 + workingHoursQ2 + workingHoursQ3 + workingHoursQ4,
        };
      } else if (this.q1 && this.q2 && this.q3) {
        this.totalSalaryOf = `Q1+Q2+Q3`;
        return {
          totalSalary: salaryForQ1 + salaryForQ2 + salaryForQ3,
          totalWorkingHours: workingHoursQ1 + workingHoursQ2 + workingHoursQ3,
        };
      } else if (this.q1 && this.q2 && this.q4) {
        this.totalSalaryOf = `Q1+Q2+Q4`;
        return {
          totalSalary: salaryForQ1 + salaryForQ2 + salaryForQ4,
          totalWorkingHours: workingHoursQ1 + workingHoursQ2 + workingHoursQ4,
        };
      } else if (this.q1 && this.q3 && this.q4) {
        this.totalSalaryOf = `Q1+Q3+Q4`;
        return {
          totalSalary: salaryForQ1 + salaryForQ3 + salaryForQ4,
          totalWorkingHours: workingHoursQ1 + workingHoursQ3 + workingHoursQ4,
        };
      } else if (this.q2 && this.q3 && this.q4) {
        this.totalSalaryOf = `Q2+Q3+Q4`;
        return {
          totalSalary: salaryForQ2 + salaryForQ3 + salaryForQ4,
          totalWorkingHours: workingHoursQ2 + workingHoursQ3 + workingHoursQ4,
        };
      } else if (this.q1 && this.q2) {
        this.totalSalaryOf = `Q1+Q2`;
        return {
          totalSalary: salaryForQ1 + salaryForQ2,
          totalWorkingHours: workingHoursQ1 + workingHoursQ2,
        };
      } else if (this.q1 && this.q3) {
        this.totalSalaryOf = `Q1+Q3`;
        return {
          totalSalary: salaryForQ1 + salaryForQ3,
          totalWorkingHours: workingHoursQ1 + workingHoursQ3,
        };
      } else if (this.q1 && this.q4) {
        this.totalSalaryOf = `Q1+Q4`;
        return {
          totalSalary: salaryForQ1 + salaryForQ4,
          totalWorkingHours: workingHoursQ1 + workingHoursQ4,
        };
      } else if (this.q2 && this.q3) {
        this.totalSalaryOf = `Q2+Q3`;
        return {
          totalSalary: salaryForQ2 + salaryForQ3,
          totalWorkingHours: workingHoursQ2 + workingHoursQ3,
        };
      } else if (this.q2 && this.q4) {
        this.totalSalaryOf = `Q2+Q4`;
        return {
          totalSalary: salaryForQ2 + salaryForQ4,
          totalWorkingHours: workingHoursQ2 + workingHoursQ4,
        };
      } else if (this.q3 && this.q4) {
        this.totalSalaryOf = `Q3+Q4`;
        return {
          totalSalary: salaryForQ3 + salaryForQ4,
          totalWorkingHours: workingHoursQ3 + workingHoursQ4,
        };
      } else if (this.q1) {
        this.totalSalaryOf = `Q1`;
        return {
          totalSalary: salaryForQ1,
          totalWorkingHours: workingHoursQ1,
        };
      } else if (this.q2) {
        this.totalSalaryOf = `Q2`;
        return {
          totalSalary: salaryForQ2,
          totalWorkingHours: workingHoursQ2,
        };
      } else if (this.q3) {
        this.totalSalaryOf = `Q3`;
        return {
          totalSalary: salaryForQ3,
          totalWorkingHours: workingHoursQ3,
        };
      } else if (this.q4) {
        this.totalSalaryOf = `Q4`;
        return {
          totalSalary: salaryForQ4,
          totalWorkingHours: workingHoursQ4,
        };
      } else {
        this.totalSalaryOf = "";
        this.displayColoum = false;
        return;
      }
    },
  },
};

export default computeMixin;
