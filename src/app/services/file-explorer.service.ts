import { Injectable } from '@angular/core';
import { FolderSttucture } from '../model/element.model';
import { v4 } from "uuid"
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileExplorerService {
  constructor(private http: HttpClient) { }

  //decarle varibales

  FolderElements: FolderSttucture[] = [];
  folders = new BehaviorSubject<FolderSttucture[]>(this.FolderElements)


  //get folders from firebase

  _queryFolder(FolderId: string) {
    const result: FolderSttucture[] = [];
    console.log(FolderId, "foler")
    // this.FolderElements.map((data: FolderSttucture) => {
    //   if (data.parentId == FolderId) {
    //     result.push(data);
    //   }
    // })
    this.http.get(`${environment.UrlDataBase}/folders.json?orderBy="parentId"&equalTo="${FolderId}"`).subscribe((data: any) => {
      Object.keys(data).map((key: string) => {
        result.push({ ...data[key], referenceId: key })
      })

    });
    this.FolderElements = result;
    this.folders.next(this.FolderElements);
    return this.folders.asObservable();
  }


  //add the folders
  _addFolder(data: Element, element: any) {
    if (data != undefined) {
      console.log(data, element);
      let value = this._generateFolder(data, element)

      this.http.post(`${environment.UrlDataBase}/folders.json`, value).subscribe((data: any) => {
        if (data) {
        console.log(data,"data")
        this.FolderElements.push({...value,referenceId:data.name});
        console.log(this.FolderElements,"fodler");
          this.folders.next(this.FolderElements);
        }
      })
    }
  }

  //generate the folder or file function in the db

  _generateFolder(data: any, element: any): FolderSttucture {
    console.log(element)
    let object: FolderSttucture = {
      id: v4(),
      name: data.name,
      isFolder: data.msg === "folder" ? true : false,
      parentId: element ? element : 'root'
    }
    return object;
  }

  //remove file or folder data base

  _removeFolder(number: any) {
    this.http.delete(`${environment.UrlDataBase}/folders/${number}.json`).subscribe(data => {
      this.FolderElements.map((dataa, index) => {
        console.log(dataa, number, "hello");
        if (dataa.referenceId == number) {
          console.log(dataa);
          this.FolderElements.splice(index, 1);
        }
      })
    });
  }

  //rename the file & folder on the data


  _changeName(name: string, id: string) {
    console.log(name, id, "id");
    this.FolderElements.map((data) => {
      if (data.id == id) {
        data.name = name;
        this.http.put(`${environment.UrlDataBase}/folders/${data.referenceId}.json`, {
          ...data, "name": name
        }).subscribe((data) => {
          console.log(data, "data");
        })
      }
    })
  }
}







































 // _changeType(index: number) {
  //   if (this.FolderElements[index].isFolder) {
  //     this.FolderElements[index].isFolder = false
  //   }
  //   else {
  //     this.FolderElements[index].isFolder = true
  //   }

  // }
