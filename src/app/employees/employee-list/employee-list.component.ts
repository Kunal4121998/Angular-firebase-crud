import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';


import { MatTableDataSource, MatSort, MatPaginatorModule, MatPaginator } from '@angular/material';
import { DepatmentService } from 'src/app/shared/depatment.service';
import { MatDialog,MatDialogConfig } from '@angular/material';
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  constructor(private employeeService:EmployeeService, private departmentService:DepatmentService,private dialog:MatDialog,
    private notificationService: NotificationService,
    private dialogService:DialogService) { }

  listData:MatTableDataSource<any>;
  displayedColumns:string[]=['fullname',
                              'email',
                            'mobile',
                          'city' ,
                          'departmentName',
                        'actions',
                       ];
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('content', {static: true}) content: ElementRef;
searchKey:string;

  
  ngOnInit() {
    this.employeeService.getEmployees().subscribe(list=>{
      let array=list.map(item =>{
        let departmentName=this.departmentService.getDepartmentName(item.payload.val()['department']);
        return {
          $key: item.key,
          departmentName,
          ...item.payload.val()
        };
      });
      this.listData=new MatTableDataSource(array);
      this.listData.sort=this.sort;
      this.listData.paginator=this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
        });
      };
    });
  }

  onSearchClear(){
    this.searchKey="";
    this.applyFilter();
  }

  applyFilter(){
    this.listData.filter=this.searchKey.trim().toLowerCase();
  }
 
  onCreate(){
    
    const dialogConfig =new MatDialogConfig();
    dialogConfig.disableClose=true;
    dialogConfig.autoFocus=true;
    dialogConfig.width="60%";
     this.dialog.open(EmployeeComponent,dialogConfig);
     this.employeeService.initializeFormGroup();
     
  }

  onEdit(row){
     this.employeeService.populateform(row);
     const dialogConfig =new MatDialogConfig();
     dialogConfig.disableClose=true;
     dialogConfig.autoFocus=true;
     dialogConfig.width="60%";
      this.dialog.open(EmployeeComponent,dialogConfig);
  }


  onDelete($key){

 this.dialogService.openConfirmDialog()
 .afterClosed().subscribe(res=>{
   if(res){
     this.employeeService.deleteEmployee($key);
     this.notificationService.warn('! Deleted Successfully');
   }
 });
 }
      downloadPdf() {
     
      } 

}
