import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FileExplorerService } from '../services/file-explorer.service';
import { MatMenuTrigger } from '@angular/material/menu'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { FolderSttucture } from '../model/element.model';

@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.scss']
})
export class FilemanagerComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  @Input() folderdata: FolderSttucture[] = [];

  @Output() removeElement = new EventEmitter<string>();

  @Output() Navigate = new EventEmitter<FolderSttucture>();

  @Output( )renameFolderid = new EventEmitter<string | any >()

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger | any;
  menuTopLeftPosition = { x: 0, y: 0 }

  ngOnInit(): void {
  }
  onRightClick(event: MouseEvent, item: any) {
    event.preventDefault();
    console.log(item);
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    this.matMenuTrigger.menuData = { item: item }
    this.matMenuTrigger.openMenu();
  }
 // emit the folder id when user click on the
  OnClick(element: FolderSttucture) {
    this.Navigate.emit(element);
  }

  removeFile(i: string) {
    this.removeElement.emit(i);
  }


  Opendialog(name: string, id: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: { name: name }
    })

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
     const data = {
      name:res.name,
      id:id
     }
     this.renameFolderid.emit(data);
    })
  }

}
