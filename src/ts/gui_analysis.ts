import Big from "big.js";
import {
    Analysis, Eigenvalue, EigenvalueList, FirstOrderLoss, FirstOrderRate, Pop, Population, PopulationList,
    RateList, SecondOrderRate
} from "./xml_analysis";
import { addID, addSaveAsCSVButton, addSaveAsPNGButton, boundary1, addRID, level1, mesmer, level0, big0, s_table, ScatterPlot, tableToCSV } from "./app";
import { getAttributes, getFirstChildNode } from "./xml";
import { createDiv, getCollapsibleDiv, addTableRow, createLabel, createTable, addTableHeaderRow } from "./html";
import { Description } from './xml_mesmer.js';
import { arrayToString, mapToString } from "./util";

const s_graph: string = "graph";

// Scatterplot font.
let sp_font: string = "2em SensSerif";

//For storing any scatter plots.
let scatterPlots: ScatterPlot[];
scatterPlots = [];

/**
 * Parses xml to initialise analysis.
 * @param xml The XML document.
 */
export function processAnalysis(xml: XMLDocument): HTMLDivElement {
    console.log(Analysis.tagName);
    let aDivID: string = addRID(Analysis.tagName, 0);
    let aDiv: HTMLDivElement = createDiv(aDivID, boundary1);
    let xml_as: HTMLCollectionOf<Element> = xml.getElementsByTagName(Analysis.tagName);
    if (xml_as.length > 0) {
        if (xml_as.length > 1) {
            throw new Error("More than one Analysis element.");
        }
        let a: Analysis = new Analysis(getAttributes(xml_as[0]));
        mesmer.setAnalysis(a);
        // "me:description".
        let xml_d: HTMLCollectionOf<Element> = xml_as[0].getElementsByTagName(Description.tagName);
        if (xml_d.length > 0) {
            if (xml_d.length == 1) {
                let s: string = getFirstChildNode(xml_d[0])?.nodeValue ?? "";
                let d: Description = new Description(getAttributes(xml_d[0]), s);
                let dDiv: HTMLDivElement = createDiv(addRID(aDivID, Description.tagName), level1);
                aDiv.appendChild(dDiv);
                dDiv.appendChild(createLabel(d.tagName + " " + s, boundary1));
                a.setDescription(d);
            } else {
                throw new Error("More than one Description element.");
            }
        }
        // "me:eigenvalueList".
        EigenvalueAnalysis(xml_as, aDivID, aDiv, a);

        // "me:populationList".
        PopulationEvolution(xml_as, aDivID, aDiv, a);

        // "me:avEnergyList".
        AverageEnergyEvolution(xml_as, aDivID, aDiv, "me:avEnergyList");

        // me:rateList.
        let xml_rl: HTMLCollectionOf<Element> = xml_as[0].getElementsByTagName(RateList.tagName);
        // Create a new collapsible div for the RateLists.
        let rlDivID = addRID(aDivID, RateList.tagName);
        let rlDiv: HTMLDivElement = createDiv(rlDivID, level1);
        let rlcDiv: HTMLDivElement = getCollapsibleDiv(rlDivID, aDiv, null, rlDiv,
            RateList.tagName + "s", boundary1, level1);
        if (xml_rl.length > 0) {
            for (let i: number = 0; i < xml_rl.length; i++) {
                let rle_attributes: Map<string, string> = getAttributes(xml_rl[i]);
                let rle_attributesKeys: string[] = Array.from(rle_attributes.keys());
                let rle_values: string[] = [];
                for (let j: number = 0; j < rle_attributesKeys.length; j++) {
                    rle_values.push(rle_attributes.get(rle_attributesKeys[j]) as string);
                }
                let rl: RateList = new RateList(rle_attributes);
                let t: string = rle_attributes.get("T") as string;
                rl.setTemperature(new Big(t));
                let conc: string = rle_attributes.get("conc") as string;
                rl.setConcentration(new Big(conc));
                let bathGas: string = rle_attributes.get("bathGas") as string;
                rl.setBathGas(bathGas);
                let units: string | undefined = rle_attributes.get("units");
                rl.setUnits(units as string);
                a.addRateList(rl);
                //let labelText: string = rl.tagName + " " + i.toString() + " " + mapToString(rle_attributes);
                let labelText: string = rl.tagName + " " + i.toString() + " T(" + t + "(K)) conc(" + rle_attributes.get("conc") + "(molec/cm3)) bathGas(" + bathGas + ")";
                // Create a new collapsible div for the RateList.
                let rleDivID: string = addRID(rlDivID, i.toString());
                let rleDiv: HTMLDivElement = createDiv(rleDivID);
                rlDiv.appendChild(rleDiv);
                let rlecDiv: HTMLDivElement = getCollapsibleDiv(rleDivID, rlDiv, null, rleDiv,
                    labelText, boundary1, level0);
                let keys: string[];
                let values: string[];
                // "me:firstOrderLoss".
                // Create a new collapsible div for the FirstOrderLosses.
                let folDivID: string = addRID(rleDivID, FirstOrderLoss.tagName);
                let folDiv: HTMLDivElement = createDiv(folDivID);
                rleDiv.appendChild(folDiv);
                let folcDiv: HTMLDivElement = getCollapsibleDiv(folDivID, rleDiv, null, folDiv,
                    FirstOrderLoss.tagName, boundary1, level1);
                let xml_fol: HTMLCollectionOf<Element> = xml_rl[i].getElementsByTagName(FirstOrderLoss.tagName);
                let folTable: HTMLTableElement = createTable(folDivID, boundary1);
                let folTableDiv: HTMLDivElement = createDiv(addRID(folDivID, s_table), level1);
                folTableDiv.appendChild(folTable);
                folDiv.appendChild(folTableDiv);
                for (let j: number = 0; j < xml_fol.length; j++) {
                    let fol_attributes: Map<string, string> = getAttributes(xml_fol[j]);
                    if (j == 0) {
                        // header
                        keys = Array.from(fol_attributes.keys());
                        /*
                        let keys2 = Array.from(fol_attributes.keys());
                        // In keys2, replace "ref" to be "reactant/product".
                        keys2 = keys2.map((key) => {
                            if (key == "ref") {
                                return "reactant/product";
                            } else {
                                return key;
                            }
                        });
                        keys2.push("kloss/" + units);
                        addTableHeaderRow(folTable, keys2);
                        */
                        keys.push("kloss/" + units);
                        addTableHeaderRow(folTable, keys);
                    }
                    values = Array.from(fol_attributes.values());
                    // Check lengths.
                    //if (keys!.length != values!.length) {
                    if (keys!.length - 1 != values!.length) {
                        console.error("FirstOrderLoss values0!.length != values!.length");
                    }
                    let s: string = (getFirstChildNode(xml_fol[j])?.nodeValue ?? "").trim();
                    let fol: FirstOrderLoss = new FirstOrderLoss(fol_attributes, new Big(s));
                    rl.addFirstOrderLoss(fol);
                    for (let k: number = 0; k < keys!.length; k++) {
                        // Check reference.
                        if (keys![k] == values![k]) {
                            values!.push(fol_attributes.get(values![k]) as string);
                        } else {
                            console.log("FirstOrderLoss values0![k] != values![k]");
                        }
                    }
                    values!.push(s);
                    addTableRow(folTable, values!);
                }
                // Insert a save as csv button.
                addSaveAsCSVButton(() => tableToCSV(folTable), folDiv, folTableDiv, "First Order Losses", level1);
                // "me:firstOrderRate".
                // Create a new collapsible div for the FirstOrderRates.
                let forDivID: string = addRID(rleDivID, FirstOrderRate.tagName);
                let forDiv: HTMLDivElement = createDiv(forDivID);
                rleDiv.appendChild(forDiv);
                let forcDiv: HTMLDivElement = getCollapsibleDiv(forDivID, rleDiv, null, forDiv,
                    FirstOrderRate.tagName, boundary1, level1);
                let xml_for: HTMLCollectionOf<Element> = xml_rl[i].getElementsByTagName(FirstOrderRate.tagName);
                let forTable: HTMLTableElement = createTable(forDivID, boundary1);
                let forTableDiv: HTMLDivElement = createDiv(addRID(forDivID, s_table), level1);
                forTableDiv.appendChild(forTable);
                forDiv.appendChild(forTableDiv);
                for (let j: number = 0; j < xml_for.length; j++) {
                    let for_attributes: Map<string, string> = getAttributes(xml_for[j]);
                    //let fromRef: string = for_attributes.get("fromRef") as string;
                    //let toRef: string = for_attributes.get("toRef") as string;
                    if (j == 0) {
                        // header
                        keys = Array.from(for_attributes.keys());
                        let keys2 = Array.from(for_attributes.keys());
                        // In keys2, replace "fromRef" to be "reactant" and "toRef" to be "product".
                        keys2 = keys2.map((key) => {
                            if (key == "fromRef") {
                                return "reactant";
                            } else if (key == "toRef") {
                                return "product";
                            } else {
                                return key;
                            }
                        });
                        keys2.push("k/" + units);
                        addTableHeaderRow(forTable, keys2);
                    }
                    values = Array.from(for_attributes.values());
                    // Check lengths.
                    if (keys!.length != values!.length) {
                        console.error("FirstOrderLoss values0!.length != values!.length");
                    }
                    let s: string = (getFirstChildNode(xml_for[j])?.nodeValue ?? "").trim();
                    let forate: FirstOrderRate = new FirstOrderRate(for_attributes, new Big(s));
                    rl.addFirstOrderRate(forate);
                    for (let k: number = 0; k < keys!.length; k++) {
                        // Check reference.
                        if (keys![k] == values![k]) {
                            values!.push(for_attributes.get(values![k]) as string);
                        } else {
                            console.log("FirstOrderRate values0![k] != values![k]");
                        }
                    }
                    values!.push(s);
                    addTableRow(forTable, values!);
                }
                // Insert a save as csv button.
                addSaveAsCSVButton(() => tableToCSV(forTable), forDiv, forTableDiv, "First Order Rates", level1);
                // "me:secondOrderRate".
                // Create a new collapsible div for the SecondOrderRates.
                let sorDivID: string = addRID(rleDivID, SecondOrderRate.tagName);
                let sorDiv: HTMLDivElement = createDiv(sorDivID);
                rleDiv.appendChild(sorDiv);
                let sorcDiv: HTMLDivElement = getCollapsibleDiv(sorDivID, rleDiv, null, sorDiv,
                    SecondOrderRate.tagName, boundary1, level1);
                let xml_sor: HTMLCollectionOf<Element> = xml_rl[i].getElementsByTagName(SecondOrderRate.tagName);
                let sorTable: HTMLTableElement = createTable(sorDivID, boundary1);
                let sorTableDiv: HTMLDivElement = createDiv(addRID(sorDivID, s_table), level1);
                sorTableDiv.appendChild(sorTable);
                sorDiv.appendChild(sorTableDiv);
                for (let j: number = 0; j < xml_sor.length; j++) {
                    let sor_attributes: Map<string, string> = getAttributes(xml_sor[j]);
                    //let fromRef: string = sor_attributes.get("fromRef") as string;
                    //let toRef: string = sor_attributes.get("toRef") as string;
                    if (j == 0) {
                        // header
                        keys = Array.from(sor_attributes.keys());
                        let keys2 = Array.from(sor_attributes.keys());
                        // In keys2, replace "fromRef" to be "reactant" and "toRef" to be "product".
                        keys2 = keys2.map((key) => {
                            if (key == "fromRef") {
                                return "reactant";
                            } else if (key == "toRef") {
                                return "product";
                            } else {
                                return key;
                            }
                        });
                        keys2.push("k/cm3molecule-1" + units);
                        addTableHeaderRow(sorTable, keys2);
                    }
                    values = Array.from(sor_attributes.values());
                    // Check lengths.
                    if (keys!.length != values!.length) {
                        console.error("SecondOrderRate values0!.length != values!.length");
                    }
                    let s: string = (getFirstChildNode(xml_sor[j])?.nodeValue ?? "").trim();
                    let sorate: SecondOrderRate = new SecondOrderRate(sor_attributes, new Big(s));
                    rl.addSecondOrderRate(sorate);
                    for (let k: number = 0; k < keys!.length; k++) {
                        // Check reference.
                        if (keys![k] == values![k]) {
                            values!.push(sor_attributes.get(values![k]) as string);
                        } else {
                            console.log("SecondOrderRate values0![k] != values![k]");
                        }
                    }
                    values!.push(s);
                    addTableRow(sorTable, values!);
                }
                // Insert a save as csv button.
                addSaveAsCSVButton(() => tableToCSV(sorTable), sorDiv, sorTableDiv, "Second Order Rates", level1);
            }
        }
    }
    return aDiv;
}

// "me:eigenvalueList".
function EigenvalueAnalysis(xml_as: HTMLCollectionOf<Element>, aDivID: string, aDiv: HTMLDivElement, a: Analysis): void {
    // Create a new collapsible div for the EigenvalueLists.
    let elDivID = addRID(aDivID, EigenvalueList.tagName);
    let elDiv: HTMLDivElement = createDiv(elDivID, level1);
    let elcDiv: HTMLDivElement = getCollapsibleDiv(elDivID, aDiv, null, elDiv,
        EigenvalueList.tagName + "s", boundary1, level1);
    let xml_el: HTMLCollectionOf<Element> = xml_as[0].getElementsByTagName(EigenvalueList.tagName);
    if (xml_el.length > 0) {
        for (let i: number = 0; i < xml_el.length; i++) {
            let el_attributes: Map<string, string> = getAttributes(xml_el[i]);
            let el: EigenvalueList = new EigenvalueList(el_attributes);
            let labelText: string = el.tagName + " " + i.toString() + " " + mapToString(el_attributes);
            // Create a new collapsible div for the EigenvalueList.
            let eDivID: string = addRID(elDiv.id, i.toString());
            let eDiv: HTMLDivElement = createDiv(elDivID, level1);
            let ecDiv: HTMLDivElement = getCollapsibleDiv(eDivID, elDiv, null, eDiv,
                labelText, boundary1, level0);
            //eDiv.appendChild(createLabel(labelText, boundary1));
            a.addEigenvalueList(el);
            // "me:eigenvalue".
            let evs: Big[] = [];
            let xml_ei: HTMLCollectionOf<Element> = xml_el[i].getElementsByTagName(Eigenvalue.tagName);
            if (xml_ei.length > 0) {
                for (let j: number = 0; j < xml_ei.length; j++) {
                    let ev: Big = new Big(getFirstChildNode(xml_ei[j])?.nodeValue as string);
                    evs.push(ev);
                    el.addEigenvalue(new Eigenvalue(getAttributes(xml_ei[j]), ev));
                }
            }
            eDiv.appendChild(createLabel(arrayToString(evs, ", "), boundary1));
        }
    }
}

// "me:populationList".
function PopulationEvolution(xml_as: HTMLCollectionOf<Element>, aDivID: string, aDiv: HTMLDivElement, a: Analysis): void {
    // Create a new collapsible div for the PopulationLists.
    let plDivID = addRID(aDivID, PopulationList.tagName);
    let plDiv: HTMLDivElement = createDiv(plDivID, level1);
    let plcDiv: HTMLDivElement = getCollapsibleDiv(plDivID, aDiv, null, plDiv,
        PopulationList.tagName + "s", boundary1, level1);
    let xml_pl: HTMLCollectionOf<Element> = xml_as[0].getElementsByTagName(PopulationList.tagName);
    if (xml_pl.length > 0) {
        // Create a new collapsible div for the PopulationList.
        for (let i: number = 0; i < xml_pl.length; i++) {
            let pl_attributes: Map<string, string> = getAttributes(xml_pl[i]);

            let pl: PopulationList = new PopulationList(pl_attributes);
            let labelText: string = pl.tagName + " " + i.toString() + " " + mapToString(pl_attributes);
            let plDivID: string = addRID(aDiv.id, PopulationList.tagName, i.toString());
            // Create a new collapsible div for the EigenvalueList.
            let pDivID: string = addRID(plDivID, i.toString());
            let pDiv: HTMLDivElement = createDiv(plDivID, level1);
            let pcDiv: HTMLDivElement = getCollapsibleDiv(pDivID, plDiv, null, pDiv,
                labelText, boundary1, level0);
            a.addPopulationList(pl);

            // "me:population".
            //let lt_ref_pop : Map<Big, Map<string, Big>> = new Map(); 
            // // Change to calculate the log of the time when creating the plots.
            let t_ref_pop: Map<Big, Map<string, Big>> = new Map();
            let refs: string[] = [];
            refs.push("time");

            let xml_pn: HTMLCollectionOf<Element> = xml_pl[i].getElementsByTagName(Population.tagName);
            if (xml_pn.length > 0) {
                for (let j: number = 0; j < xml_pn.length; j++) {
                    let pn_attributes: Map<string, string> = getAttributes(xml_pn[j]);

                    let population: Population = new Population(pn_attributes, []);
                    pl.addPopulation(population);

                    let t: Big = pn_attributes.get("time") != undefined ? new Big(pn_attributes.get("time") as string) : big0;
                    //let lt: Big = pn_attributes.get("logTime") != undefined ? new Big(pn_attributes.get("logTime") as string) : big0; 

                    let ref_pop: Map<string, Big> = new Map();

                    //lt_ref_pop.set(lt, ref_pop);
                    t_ref_pop.set(t, ref_pop);

                    let xml_pop: HTMLCollectionOf<Element> = xml_pn[j].getElementsByTagName(Pop.tagName);
                    if (xml_pop.length > 0) {
                        for (let k: number = 0; k < xml_pop.length; k++) {
                            let pop_attributes: Map<string, string> = getAttributes(xml_pop[k]);
                            let ref: string = pop_attributes.get("ref") as string;
                            if (j == 0) {
                                refs.push(ref);
                            }
                            let p: Big = new Big(getFirstChildNode(xml_pop[k])?.nodeValue as string);
                            let pop: Pop = new Pop(pop_attributes, p);
                            population.addPop(pop);
                            ref_pop.set(ref, p);
                        }
                    }
                }
            }
            // Create graph.
            createGraph(pDiv, pDivID, t_ref_pop, labelText);

            // Create Table.
            let tableDiv: HTMLDivElement = createDiv(addRID(pDivID, s_table), boundary1);
            pDiv.appendChild(tableDiv);
            let tab = createTable(addRID(plDivID, s_table), boundary1);
            addTableHeaderRow(tab, refs);
            t_ref_pop.forEach((ref_pop, t) => {
                let row: string[] = [];
                row.push(t.toString());
                ref_pop.forEach((p, ref) => {
                    row.push(p.toString());
                });
                addTableRow(tab, row);
            });
            tableDiv.appendChild(tab);
            // Insert a save as csv button.
            addSaveAsCSVButton(() => tableToCSV(tab), pDiv, tableDiv, labelText, boundary1);
        }
    }
}

// "me:avEnergyList".
function AverageEnergyEvolution(xml_as: HTMLCollectionOf<Element>, aDivID: string, aDiv: HTMLDivElement, tagName: string): void {
    // Create a new collapsible div for the PopulationLists.
    let plDivID = addRID(aDivID, tagName);
    let plDiv: HTMLDivElement = createDiv(plDivID, level1);
    let plcDiv: HTMLDivElement = getCollapsibleDiv(plDivID, aDiv, null, plDiv, tagName + "s", boundary1, level1);
    let xml_pl: HTMLCollectionOf<Element> = xml_as[0].getElementsByTagName(tagName);
    if (xml_pl.length > 0) {
        // Create a new collapsible div for the PopulationList.
        for (let i: number = 0; i < xml_pl.length; i++) {
            let pl_attributes: Map<string, string> = getAttributes(xml_pl[i]);

            let pl: PopulationList = new PopulationList(pl_attributes);
            let labelText: string = tagName + " " + i.toString() + " " + mapToString(pl_attributes);
            let plDivID: string = addRID(aDiv.id, tagName, i.toString());
            let pDivID: string = addRID(plDivID, i.toString());
            let pDiv: HTMLDivElement = createDiv(plDivID, level1);
            let pcDiv: HTMLDivElement = getCollapsibleDiv(pDivID, plDiv, null, pDiv, labelText, boundary1, level0);

            // "me:avEnergy".
            // Change to calculate the log of the time when creating the plots.
            let t_ref_pop = new Map<Big, Map<string, Big>>();
            let xml_pn: HTMLCollectionOf<Element> = xml_pl[i].getElementsByTagName("me:avEnergy");
            if (xml_pn.length > 0) {
                // SHR May 2025: The following temporary Map is based on type string because Map.has(key) fails for type Big.
                let tmp_pop = new Map<string, Map<string, Big>>(); 
                for (let j: number = 0; j < xml_pn.length; j++) {  // Loop over the  number of species.
                    let pn_attributes: Map<string, string> = getAttributes(xml_pn[j]);
                    let species: string = pn_attributes.get("ref") as string;
                    let xml_pop: HTMLCollectionOf<Element> = xml_pn[j].getElementsByTagName("me:Av");
                    if (xml_pop.length > 0) {
                        for (let k: number = 0; k < xml_pop.length; k++) { // Loop over the number of timesteps.
                            let pop_attributes: Map<string, string> = getAttributes(xml_pop[k]);
                            let time: string = pop_attributes.get("time") as string ;
                            let t: Big = pop_attributes.get("time") != undefined ? new Big(pop_attributes.get("time") as string) : big0;
                            let energy: string = xml_pop[k].textContent as string;
                            if (tmp_pop.has(time)) {
                                tmp_pop.get(time)?.set(species, Big(energy)); 
                            } else {
                                let ref_pop = new Map<string, Big.Big>() ;
                                ref_pop.set(species, Big(energy));
                                tmp_pop.set(time, ref_pop);
                            }
                        }
                    }
                }
                if (tmp_pop.size > 0) {
                   for (let key of tmp_pop.keys()) 
                    t_ref_pop.set(Big(key), tmp_pop.get(key) as Map<string, Big.Big>) ;
                }
            }
            // Create graph.
            createGraph(pDiv, pDivID, t_ref_pop, labelText);
        }
    }
 }

// Create graph.
function createGraph(pDiv: HTMLDivElement, pDivID: string, t_ref_pop: Map<Big, Map<string, Big>>, labelText: string): void {
    let graphDiv: HTMLDivElement = createDiv(addRID(pDivID, s_graph), boundary1);
    pDiv.appendChild(graphDiv);
    let canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
    graphDiv.appendChild(canvas);
    // Create a scatter plot.
    let scatterPlot: ScatterPlot = new ScatterPlot(canvas, t_ref_pop, sp_font);
    // Add the scatter plot to the collection.
    scatterPlots.push(scatterPlot);
    //scatterPlot.draw();
    // Add a save to PNG button.
    addSaveAsPNGButton(canvas, pDiv, graphDiv, labelText);
}
