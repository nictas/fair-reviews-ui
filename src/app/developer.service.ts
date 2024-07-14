import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DeveloperService {

    constructor(private httpClient: HttpClient) { }

    getDevelopers() {
        this.httpClient.get<string>("http://localhost:8090/rest/developers").subscribe(data => console.log(`Received data: ${JSON.stringify(data)}`));
    }

}
