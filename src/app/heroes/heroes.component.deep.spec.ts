import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component"

describe('HeroesComponent', () => { 
    let fixture: ComponentFixture<HeroesComponent>;
    let HEROES;
    let mockHeroService;

 
    beforeEach(() => {
        HEROES = [
        {id:1, name: 'SpiderDude', strength: 8},
        {id:2, name: 'Wonderful Woman', strength: 24},
        {id:3, name: 'SuperDude', strength: 55}
        ]
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        fixture= TestBed.createComponent(HeroesComponent);
        
        mockHeroService.getHeroes.and.returnValue(of(HEROES))
        fixture.detectChanges();
    });

    it('should set heroes from the service', () => {

        expect(fixture.componentInstance.heroes.length).toEqual(3);
    })
    
    it('should create one li for each hero', () => {

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    })

    it('should render each hero as a heroComponent', () => {
        
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent))
        expect(heroComponents.length).toBe(3);
        for(let i=0; i< heroComponents.length; i++){
            expect(heroComponents[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    })
})