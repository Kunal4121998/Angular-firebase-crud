import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firebase: AngularFireDatabase, private datePipe: DatePipe) { }

  employeeList: AngularFireList<any>;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fullname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    mobile: new FormControl('', [Validators.required, Validators.minLength(8)]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl(0),
    hiredate: new FormControl(''),
    ispermanent: new FormControl(false)
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      fullname: '',
      email: '',
      mobile: '',
      city: '',
      gender: '1',
      department: 0,
      hiredate: '',
      ispermanent: false
    });
  }


  getEmployees() {
    this.employeeList = this.firebase.list('employees');
    return this.employeeList.snapshotChanges();
  }

  insertEmployee(employee) {
    this.employeeList.push({
      fullname: employee.fullname,
      email: employee.email,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      department: employee.department,
       hiredate: employee.hiredate == "" ? "" : this.datePipe.transform(employee.hiredate, 'yyyy-MM-dd'),
      ispermanent: employee.ispermanent
    });
  }

  updateEmployee(employee) {
    this.employeeList.update(employee.$key,
      {
        fullName: employee.fullName,
        email: employee.email,
        mobile: employee.mobile,
        city: employee.city,
        gender: employee.gender,
        department: employee.department,
         hiredate: employee.hiredate == "" ? "" : this.datePipe.transform(employee.hiredate, 'yyyy-MM-dd'),
        ispermanent: employee.ispermanent
      });
  }

  deleteEmployee($key: string) {
    this.employeeList.remove($key);
  }

  populateform(employee) {
    this.form.setValue(_.omit(employee,'departmentName'));
  }
}