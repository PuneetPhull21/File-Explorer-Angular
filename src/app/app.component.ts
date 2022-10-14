import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { FolderSttucture } from './model/element.model';
import { FileExplorerService } from './services/file-explorer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  folderName: string = '';
  id: string | any = "";
  path: string = 'Root'
  navigation: { name: string, id: string }[] = [{ name: "Home", id: "root" }]
  folderData: FolderSttucture[] | any = []
  currentRoot: FolderSttucture | null = null;

  spinner: boolean = false



  constructor(public dialog: MatDialog, public fileService: FileExplorerService, private route: ActivatedRoute, private router: Router, private location: Location) { }
  Opendialog(isfolder: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: { name: this.folderName, msg: isfolder }
    })
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      this.folderName = res;
      this.fileService._addFolder(res, this.currentRoot)
      // this.updateFileElementQuery();
      this.folderName = ''
    })
  }

  navigationpush(name: string, id: string) {
    let data = { name, id };
    this.navigation.push(data);
  }
  NavigateToFolder(element: FolderSttucture) {
    console.log(element, "ele");
    this.currentRoot = element;
    this.navigationpush(element.name, element.id);
    // this.currentPath = this.pushtopath(this.currentRoot, element.name);
    this.router.navigate([''], { queryParams: { 'id': element.id } });
    this.fileService._queryFolder(element.id).subscribe((data) => {
      this.folderData = data;
    });
    console.log(element.id, "id");
  }

  removequery(i: string) {
    this.fileService._removeFolder(i);
    // this.updateFileElementQuery();
  }

  // pushtopath(Currentpath: any, name: string) {
  //   if (Currentpath.parentId === "root") {
  //     return Currentpath.parentId
  //   }
  //   else {
  //     let p = Currentpath.parentId + '/';
  //     p += `${name}/`
  //     console.log(p)
  //     return p
  //   }
  // }

  renameFolder(data: any) {
    this.fileService._changeName(data.name, data.id);
  }


  _goBackSingle() {

    this.location.back();
    this.navigation.pop();
  }


  _dynamicNavigation(element: any, index: number) {
    if (index !== this.navigation.length - 1) {
      const newArray = this.navigation.slice(0, index + 1);
      this.navigation = newArray;
      this.router.navigate([''], { queryParams: { 'id': element.id } });

    }
  }


  ngOnInit(): void {

    this.route.queryParams.subscribe((data: any) => {
      this.spinner = true;
      console.log(data, "elments");

      if (data.id) {
        this.currentRoot = data.id;
        this.fileService._queryFolder(data.id).subscribe((data) => {
          this.folderData = data

        });
      }
      else {
        this.fileService._queryFolder("root").subscribe((data) => {
          console.log(data);
          console.log(this.currentRoot, "root");
          this.folderData = data;
        });
      }
      this.spinner = false;

    })
    // this.fileService._queryFolder(this.currentRoot ? this.currentRoot.id : "root").subscribe((data) => {
    //   console.log(data);
    //   console.log(this.currentRoot, "root");
    //   this.folderData = data;
    // });

    // this.router.events.subscribe(event =>{
    //   console.log(this.route.snapshot);
    //   // this.id = params.get('id');
    //   console.log(event);
    // })
  }
  // updateFileElementQuery() {
  //   this.fileService._queryFolder(this.currentRoot ? this.currentRoot.id : 'root').subscribe((data) => {
  //     this.folderData = data
  //   });
  // }

}
