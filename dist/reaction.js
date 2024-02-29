"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reaction = exports.ZhuNakamuraCrossing = exports.MesmerILT = exports.MCRCMethod = exports.Tunneling = exports.NInfinity = exports.TInfinity = exports.ActivationEnergy = exports.PreExponential = exports.TransitionState = exports.Product = exports.Reactant = exports.ReactionMolecule = void 0;
const functions_js_1 = require("./functions.js");
const classes_js_1 = require("./classes.js");
const xml_js_1 = require("./xml.js");
/**
 * A class for representing a Reaction Molecule.
 */
class ReactionMolecule extends classes_js_1.TagWithAttributes {
    /**
     * The molecule.
     */
    static tagName = "molecule";
    /**
     * A reference to the molecule.
     */
    molecule;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes, molecule) {
        super(attributes, ReactionMolecule.tagName);
        this.molecule = molecule;
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} pad The pad for an extra level of padding (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName, pad, padding) {
        let padding1;
        if (pad != undefined && padding != undefined) {
            padding1 = padding + pad;
        }
        let s = this.getSelfClosingTag(padding1);
        return (0, xml_js_1.getTag)(s, tagName, undefined, padding, true);
    }
}
exports.ReactionMolecule = ReactionMolecule;
/**
 * A class for representing a reactant.
 * This is a molecule often with a role in a reaction.
 */
class Reactant extends ReactionMolecule {
    /**
     * The tag name.
     */
    static tagName = "reactant";
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes, molecule) {
        super(attributes, molecule);
    }
}
exports.Reactant = Reactant;
/**
 * A class for representing a product.
 * This is a molecule produced in a reaction.
 */
class Product extends ReactionMolecule {
    /**
     * The tag name.
     */
    static tagName = "product";
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes, molecule) {
        super(attributes, molecule);
    }
}
exports.Product = Product;
/**
 * A class for representing a transition state.
 */
class TransitionState extends ReactionMolecule {
    /**
     * The tag name.
     */
    static tagName = "me:transitionState";
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes, molecule) {
        super(attributes, molecule);
    }
    /**
     * A convenience method to get the ref (the molecule ID) of the transition state.
     * @returns The ref of the transition state.
     */
    getRef() {
        let s = this.attributes.get("ref");
        if (s == null) {
            throw new Error('Attribute "ref" is undefined.');
        }
        return s;
    }
}
exports.TransitionState = TransitionState;
/**
 * A class for representing the Arrhenius pre-exponential factor.
 */
class PreExponential extends classes_js_1.NumberNode {
    /**
     * The tag name.
     */
    static tagName = "me:preExponential";
    /**
     * A class for representing the Arrhenius pre-exponential factor.
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes, value) {
        super(attributes, PreExponential.tagName, value);
    }
}
exports.PreExponential = PreExponential;
/**
 * A class for representing the Arrhenius activation energy factor.
 */
class ActivationEnergy extends classes_js_1.NumberNode {
    /**
     * The tag name.
     */
    static tagName = "me:activationEnergy";
    /**
     * A class for representing the Arrhenius pre-exponential factor.
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes, value) {
        super(attributes, ActivationEnergy.tagName, value);
    }
}
exports.ActivationEnergy = ActivationEnergy;
/**
 * A class for representing the reference temperature.
 */
class TInfinity extends classes_js_1.NumberNode {
    /**
     * The tag name.
     */
    static tagName = "me:TInfinity";
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes, value) {
        super(attributes, TInfinity.tagName, value);
    }
}
exports.TInfinity = TInfinity;
/**
 * A class for representing the modified Arrhenius parameter factor.
 */
class NInfinity extends classes_js_1.NumberNode {
    /**
     * The tag name.
     */
    static tagName = "me:nInfinity";
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes, value) {
        super(attributes, NInfinity.tagName, value);
    }
}
exports.NInfinity = NInfinity;
/**
 * A class for representing tunneling.
 */
class Tunneling extends classes_js_1.TagWithAttributes {
    /**
     * The tag name.
     */
    static tagName = "me:tunneling";
    /**
     * @param {Map<string, string>} attributes The attributes.
     */
    constructor(attributes) {
        super(attributes, Tunneling.tagName);
    }
}
exports.Tunneling = Tunneling;
/**
 * A class for representing the MCRCMethod specifications.
 * Extended classes indicate how microcanonical rate constant is to be treated.
 */
class MCRCMethod extends classes_js_1.TagWithAttributes {
    /**
     * The tag name.
     */
    static tagName = "me:MCRCMethod";
    /**
     * @param {Map<string, string>} attributes The attributes.
     */
    constructor(attributes) {
        super(attributes, MCRCMethod.tagName);
    }
}
exports.MCRCMethod = MCRCMethod;
/**
 * A class for representing the inverse Laplace transform (ILT) type of microcanonical rate constant.
 */
class MesmerILT extends MCRCMethod {
    /**
     * The pre-exponential factor.
     */
    preExponential;
    /**
     * The activation energy.
     */
    activationEnergy;
    /**
     * The TInfinity.
     */
    tInfinity;
    /**
     * The nInfinity.
     */
    nInfinity;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {PreExponential | undefined} preExponential The pre-exponential factor.
     * @param {ActivationEnergy | undefined} activationEnergy The activation energy.
     * @param {TInfinity | undefined} tInfinity The TInfinity.
     * @param {NInfinity | undefined} nInfinity The nInfinity.
     */
    constructor(attributes, preExponential, activationEnergy, tInfinity, nInfinity) {
        super(attributes);
        this.preExponential = preExponential;
        this.activationEnergy = activationEnergy;
        this.tInfinity = tInfinity;
        this.nInfinity = nInfinity;
    }
    toString() {
        return `MesmerILT(${super.toString()}, ` +
            `preExponential(${this.preExponential}), ` +
            `activationEnergy(${this.activationEnergy}), ` +
            `TInfinity(${this.tInfinity}), ` +
            `nInfinity(${this.nInfinity}))`;
    }
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName, padding) {
        let padding1 = "";
        if (padding != undefined) {
            padding1 = padding + "  ";
        }
        let preExponential_xml = "";
        if (this.preExponential != undefined) {
            preExponential_xml = this.preExponential.toXML(padding1);
        }
        let activationEnergy_xml = "";
        if (this.activationEnergy != undefined) {
            activationEnergy_xml = this.activationEnergy.toXML(padding1);
        }
        let tInfinity_xml = "";
        if (this.tInfinity != undefined) {
            tInfinity_xml = this.tInfinity.toXML(padding1);
        }
        let nInfinity_xml = "";
        if (this.nInfinity != undefined) {
            nInfinity_xml = this.nInfinity.toXML(padding1);
        }
        return (0, xml_js_1.getTag)(preExponential_xml + activationEnergy_xml + tInfinity_xml + nInfinity_xml, tagName, this.attributes, padding, true);
    }
}
exports.MesmerILT = MesmerILT;
/**
 * A class for representing the Zhu-Nakamura crossing MCRCMethod.
 */
class ZhuNakamuraCrossing extends MCRCMethod {
    harmonicReactantDiabat_FC;
    harmonicReactantDiabat_XO;
    harmonicProductDiabat_DE;
    exponentialProductDiabat_A;
    exponentialProductDiabat_B;
    exponentialProductDiabat_DE;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} harmonicReactantDiabat_FC The harmonic reactant diabatic FC.
     * @param {number} harmonicReactantDiabat_XO The harmonic reactant diabatic XO.
     * @param {number} harmonicProductDiabat_DE The harmonic product diabatic DE.
     * @param {number} exponentialProductDiabat_A The exponential product diabatic A.
     * @param {number} exponentialProductDiabat_B The exponential product diabatic B.
     * @param {number} exponentialProductDiabat_DE The exponential product diabatic DE.
     */
    constructor(attributes, harmonicReactantDiabat_FC, harmonicReactantDiabat_XO, harmonicProductDiabat_DE, exponentialProductDiabat_A, exponentialProductDiabat_B, exponentialProductDiabat_DE) {
        super(attributes);
        this.harmonicReactantDiabat_FC = harmonicReactantDiabat_FC;
        this.harmonicReactantDiabat_XO = harmonicReactantDiabat_XO;
        this.harmonicProductDiabat_DE = harmonicProductDiabat_DE;
        this.exponentialProductDiabat_A = exponentialProductDiabat_A;
        this.exponentialProductDiabat_B = exponentialProductDiabat_B;
        this.exponentialProductDiabat_DE = exponentialProductDiabat_DE;
    }
    toString() {
        return `ZhuNakamuraCrossing(${super.toString()}, ` +
            `harmonicReactantDiabat_FC(${this.harmonicReactantDiabat_FC.toString()}), ` +
            `harmonicReactantDiabat_XO(${this.harmonicReactantDiabat_XO.toString()}), ` +
            `harmonicProductDiabat_DE(${this.harmonicProductDiabat_DE.toString()}), ` +
            `exponentialProductDiabat_A(${this.exponentialProductDiabat_A.toString()}), ` +
            `exponentialProductDiabat_B(${this.exponentialProductDiabat_B.toString()}), ` +
            `exponentialProductDiabat_DE(${this.exponentialProductDiabat_DE.toString()}))`;
    }
}
exports.ZhuNakamuraCrossing = ZhuNakamuraCrossing;
/**
 * A class for representing the sum of states.
 * @param {string} units The units of energy.
 * @param {boolean} angularMomentum The angular momentum attribute.
 * @param {boolean} noLogSpline The no log spline attribute.
 * @param {SumOfStatesPoint[]} sumOfStatesPoints The sum of states points.
 */
/*
export class SumOfStates extends NumberWithAttributes {
    units: string;
    angularMomentum: boolean;
    noLogSpline: boolean;
    sumOfStatesPoints: SumOfStatesPoint[];
    constructor(units: string, angularMomentum: boolean, noLogSpline: boolean, sumOfStatesPoints: SumOfStatesPoint[]) {
        this.units = units;
        this.angularMomentum = angularMomentum;
        this.noLogSpline = noLogSpline;
        this.sumOfStatesPoints = sumOfStatesPoints;
    }
    toString() {
        return `SumOfStates(` +
            `units(${this.units}), ` +
            `angularMomentum(${this.angularMomentum.toString()}), ` +
            `noLogSpline(${this.noLogSpline.toString()}), ` +
            `sumOfStatesPoints(${arrayToString(this.sumOfStatesPoints, " ")}))`;
    }
}
*/
/**
 * A class for representing a sum of states point.
 * @param {number} value The value of the point.
 * @param {number} energy The energy of the point.
 * @param {number} angMomMag The angular momentum magnitude of the point.
 */
/*
export class SumOfStatesPoint {
    value: number;
    energy: number;
    angMomMag: number;
    constructor(value: number, energy: number, angMomMag: number) {
        this.value = value;
        this.energy = energy;
        this.angMomMag = angMomMag;
    }
    toString() {
        return `SumOfStatesPoint(` +
            `value(${this.value}), ` +
            `energy(${this.energy.toString()}), ` +
            `angMomMag(${this.angMomMag.toString()}))`;
    }
}
*/
/**
 * A class for representing the DefinedSumOfStates MCRCMethod.
 * @param {string} name The name or xsi:type of the method.
 * @param {SumOfStates} sumOfStates The sum of states.
 */
/*
export class DefinedSumOfStates extends MCRCMethod {
    sumOfStates: SumOfStates;

    constructor(name: string, sumOfStates: SumOfStates) {
        super(name);
        this.sumOfStates = sumOfStates;
    }
    toString() {
        return `DefinedSumOfStates(${super.toString()}, ` +
            `sumOfStates(${this.sumOfStates.toString()}))`;
    }
}
*/
/**
 * A class for representing a reaction.
 */
class Reaction extends classes_js_1.NodeWithNodes {
    /**
     * The tag name.
     */
    static tagName = "reaction";
    /**
     * The id of the reaction. This is also stored in the attributes, but is hee for convenience...
     */
    id;
    /**
     * The reactants in the reaction.
     */
    reactants;
    /**
     * The products of the reaction.
     */
    products;
    /**
     * The MCRCMethod.
     */
    mCRCMethod;
    /**
     * The transition state.
     */
    transitionState;
    /**
     * The tunneling.
     */
    tunneling;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {string} id The id of the reaction.
     * @param {Map<string, Reactant>} reactants The reactants in the reaction.
     * @param {Map<string, Product>} products The products of the reaction.
     * @param {MCRCMethod | undefined} mCRCMethod The MCRCMethod (optional).
     * @param {TransitionState | undefined} transitionState The transition state (optional).
     * @param {Tunneling | undefined} tunneling The tunneling (optional).
     */
    constructor(attributes, id, reactants, products, mCRCMethod, transitionState, tunneling) {
        super(attributes, Reaction.tagName);
        this.id = id;
        this.reactants = reactants;
        this.products = products;
        this.mCRCMethod = mCRCMethod;
        this.transitionState = transitionState;
        this.tunneling = tunneling;
    }
    /**
     * Convert the product to a string.
     * @returns String representation of the product.
     */
    toString() {
        let s = super.toString();
        return super.toString() + `id(${this.id}), ` +
            `reactants(${(0, functions_js_1.mapToString)(this.reactants)}), ` +
            `products(${(0, functions_js_1.mapToString)(this.products)}), ` +
            `mCRCMethod(${this.mCRCMethod?.toString()}), ` +
            `transitionState(${this.transitionState?.toString()}), ` +
            `tunneling(${this.tunneling?.toString()}))`;
    }
    /**
     * Get the label of the reactants.
     * @returns The label of the reactants.
     */
    getReactantsLabel() {
        return Array.from(this.reactants.values()).map(reactant => reactant.molecule.id).join(' + ');
    }
    /**
     * Get the combined energy of the reactants.
     * @returns The combined energy of the reactants.
     */
    getReactantsEnergy() {
        return Array.from(this.reactants.values()).map(reactant => reactant.molecule.getEnergy()).reduce((a, b) => a + b, 0);
    }
    /**
     * Returns the label for the products.
     * @returns The label for the products.
     */
    getProductsLabel() {
        return Array.from(this.products.values()).map(product => product.molecule.id).join(' + ');
    }
    /**
     * Returns the total energy of all products.
     * @returns The total energy of all products.
     */
    getProductsEnergy() {
        return Array.from(this.products.values()).map(product => product.molecule.getEnergy()).reduce((a, b) => a + b, 0);
    }
    /**
     * Get the label of the reaction.
     * @returns The label of the reaction.
     */
    getLabel() {
        let label = this.getReactantsLabel() + ' -> ' + this.getProductsLabel();
        return label;
    }
    /**
     * @param {string} tagName The tag name.
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName, pad, level) {
        // Padding
        let padding0 = "";
        let padding1 = "";
        let padding2 = "";
        let padding3 = "";
        if (pad != undefined && level != undefined) {
            padding0 = pad.repeat(level);
            padding1 = padding0 + pad;
            padding2 = padding1 + pad;
            padding3 = padding2 + pad;
        }
        // Reactants
        let reactants_xml = "";
        this.reactants.forEach(reactant => {
            reactants_xml += reactant.toXML("reactant", pad, padding1);
        });
        // Products
        let products_xml = "";
        this.products.forEach(product => {
            products_xml += product.toXML("product", pad, padding1);
        });
        // Tunneling
        let tunneling_xml = "";
        if (this.tunneling != undefined) {
            tunneling_xml = this.tunneling.getSelfClosingTag(padding1);
        }
        // TransitionState
        let transitionState_xml = "";
        if (this.transitionState != undefined) {
            transitionState_xml = this.transitionState.toXML(TransitionState.tagName, pad, padding1);
        }
        // MCRCMethod
        let mCRCMethod_xml = "";
        if (this.mCRCMethod != undefined) {
            if (this.mCRCMethod instanceof MesmerILT) {
                mCRCMethod_xml = this.mCRCMethod.toXML(padding1);
            }
            else {
                mCRCMethod_xml = this.mCRCMethod.getSelfClosingTag(padding1);
            }
        }
        return (0, xml_js_1.getTag)(reactants_xml + products_xml + tunneling_xml + transitionState_xml + mCRCMethod_xml, tagName, this.attributes, padding0, true);
    }
}
exports.Reaction = Reaction;
//# sourceMappingURL=reaction.js.map