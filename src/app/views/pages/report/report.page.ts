import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  reportData = null;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.reportData = this.activatedRoute.snapshot.paramMap.get('id')
  }

  async reportPage(route: any) {
    let data = []
    data.push({"report_header":route})
    data.push({"report_body":this.reportData});
   
    this.router.navigate([`${route}/`+JSON.stringify("")]);



    
    //localStorage.setItem("report", localStorage.getItem("report") + route);


    var data1 = localStorage.getItem('report');
    data1 = data1 ? JSON.parse(data1) : {};
    data1['tag'] = route;
    localStorage.setItem('report', JSON.stringify(data1));
  }


}
