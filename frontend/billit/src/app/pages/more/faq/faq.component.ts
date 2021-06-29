import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../../../shared/models/enums/question.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FAQComponent implements OnInit {
  questions: Question[];
  expanded: boolean[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.initialiseQuestions();
    this.expanded = this.questions.map(_ => false);
  }

  expand(i) {
    this.expanded[i] = !this.expanded[i];
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['./..'], {relativeTo: this.route});
  }

  private initialiseQuestions() {
    this.questions = [
      {
        question: 'How can i add a bill?',
        answer: `By clicking on the red "plus" button in the bottom right corner on "Bills" page. You can then choose to scan its QR or add it manually.`
      },
      {
        question: `How can i delete a bill?`,
        answer: `By swiping right on the bill listed on "Bills" page or by clicking on the button in the top right corner of the bill's page and then hitting "Delete".`
      },
      {
        question: `How can I find a specific bill?`,
        answer: `By clicking on the search button in the top left corner on "Bills" page. You can then search for a bill's number, a store, product or category. Another alternative is to add that bill to "Favourites".`
      },
      {
        question: `What does "Favourites" mean?`,
        answer: `Adding a bill to "Favourites", by swiping right on the bill, helps you highlight the ones that are important to you. You can find them all by clicking on the filter button in the top right corner of "Bills" page and hitting "Favourites".`
      },
      {
        question: `What does "Trusted" mean?`,
        answer: `The bills listed on "Trusted" with the store icon in green are the ones you added by scanning a QR from a trusted store. You can use those bills to return your products just like you would use the original printed bill.`
      },
      {
        question: `What is a trusted store?`,
        answer: `A trusted store is a partner of ours that offers you the option to scan a bill's QR and have it on your phone instead of using the actual printed bill.`
      },
      {
        question: `I've entered the bill's information wrong. How can i edit that bill?`,
        answer: `By clicking on the button in the top right corner of the bill's page and hitting "Edit". You will not be able to edit a "Trusted" bill.`
      },
      {
        question: `What's the deal with "Categories"?`,
        answer: `This is a feature that helps you keep track of the products you bought and better organise yourself. Either it's about coffe, vegetables or clothes, you can manually add a bill to a category like, or automatically have the category completed when scanning a QR code, so you can see some statistics about them.`
      },
      {
        question: `Why can't I scan a QR/barcode?`,
        answer: `Scanning a random QR or barcode will do nothing. You can only scan QR codes of a bill from a trusted store.`
      },
    ];
  }
}
