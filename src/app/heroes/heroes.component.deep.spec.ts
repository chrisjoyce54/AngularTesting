import { Directive, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from './heroes.component';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[routerLink]',
    // tslint:disable-next-line:use-host-property-decorator
    host: { '(click)': 'onClick()'}
})
// tslint:disable-next-line:directive-class-suffix
export default class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
        {id: 1, name: 'SpiderDude', strength: 8},
        {id: 2, name: 'Wonderful Woman', strength: 24},
        {id: 3, name: 'SuperDude', strength: 55}
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService}
            ],
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);

        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
    });

    it('should set heroes from the service', () => {

        expect(fixture.componentInstance.heroes.length).toEqual(3);
    });

    it('should create one li for each hero', () => {

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    });

    it('should render each hero as a heroComponent', () => {

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponents.length).toBe(3);
        for (let i = 0; i < heroComponents.length; i++) {
            expect(heroComponents[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });

    it(`should call heroService.deleteHero when the Hero Componenet's
        delete button is clicked`, () => {
            spyOn(fixture.componentInstance, 'delete');

            fixture.detectChanges();

            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
            heroComponents[0].query(By.css('button'))
                .triggerEventHandler('click', {stopPropagation: () => {}});

            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

        });

        // Tell child component to raise delete event
        it(`should call heroService.deleteHero when the Hero Componenet's
            delete button is raised by the component`, () => {
                spyOn(fixture.componentInstance, 'delete');

                fixture.detectChanges();

                const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

                // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);
                // Another way  to dothe same thing using debug object
                heroComponents[0].triggerEventHandler('delete', null);

                expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

            });

        it('should add a new hero to the list when the add button is clicked', () => {
            const name = 'Mr. Ice';
            mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
            const inputElelment = fixture.debugElement.query(By.css('input')).nativeElement;
            const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

            inputElelment.value = name;
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            const herotext = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
            expect(herotext).toContain(name);
        });

        it('should have the correct route for the first hero', () => {
            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

            const routerLink = heroComponents[0]
                .query(By.directive(RouterLinkDirectiveStub))
                .injector.get(RouterLinkDirectiveStub);

            heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);
            expect(routerLink.navigatedTo).toBe('/detail/1');
        });
});
