import {AbstractSimpleFilter, IAbstractSimpleFilterParams, IAbstractSimpleModel} from "./abstractSimpleFilter";
import {Comparator} from "./abstractFilter";
import {IDoesFilterPassParams} from "../../interfaces/iFilter";

export interface NullComparator2 {
    equals?: boolean;
    lessThan?: boolean;
    greaterThan?: boolean;
}

export interface IScalarFilterParams2 extends IAbstractSimpleFilterParams {
    inRangeInclusive?: boolean;
    nullComparator?: NullComparator2;
}

export abstract class AbstractScalerFilter<M extends IAbstractSimpleModel, T> extends AbstractSimpleFilter<M> {

    static readonly DEFAULT_NULL_COMPARATOR: NullComparator2 = {
        equals: false,
        lessThan: false,
        greaterThan: false
    };

    private scalarFilterParams: IScalarFilterParams2;

    protected abstract comparator(): Comparator<T>;

    // because the date and number filter models have different attribute names, we have to map
    protected abstract mapRangeFromModel(filterModel: IAbstractSimpleModel): {from: T, to: T};

    protected setParams(params: IScalarFilterParams2): void {
        super.setParams(params);
        this.scalarFilterParams = params;
    }

    private nullComparator(selectedOption: string, filterValue: T, gridValue: T): number {
        if (gridValue == null) {
            const nullValue = this.canNullsPassFilter(selectedOption);

            if (selectedOption === AbstractScalerFilter.EMPTY) {
                return 0;
            }

            if (selectedOption === AbstractScalerFilter.EQUALS) {
                return nullValue ? 0 : 1;
            }

            if (selectedOption === AbstractScalerFilter.GREATER_THAN) {
                return nullValue ? 1 : -1;
            }

            if (selectedOption === AbstractScalerFilter.GREATER_THAN_OR_EQUAL) {
                return nullValue ? 1 : -1;
            }

            if (selectedOption === AbstractScalerFilter.LESS_THAN_OR_EQUAL) {
                return nullValue ? -1 : 1;
            }

            if (selectedOption === AbstractScalerFilter.LESS_THAN) {
                return nullValue ? -1 : 1;
            }

            if (selectedOption === AbstractScalerFilter.NOT_EQUAL) {
                return nullValue ? 1 : 0;
            }
        }

        const actualComparator: Comparator<T> = this.comparator();
        return actualComparator(filterValue, gridValue);
    }

    private canNullsPassFilter(type: string): boolean {
        const reducedType: string =
            type.indexOf('greater') > -1 ? 'greaterThan' :
                type.indexOf('lessThan') > -1 ? 'lessThan' :
                    'equals';

        if (this.scalarFilterParams.nullComparator && (this.scalarFilterParams.nullComparator as any)[reducedType]) {
            return (this.scalarFilterParams.nullComparator as any)[reducedType];
        }

        return (AbstractScalerFilter.DEFAULT_NULL_COMPARATOR as any)[reducedType];
    }

    protected individualFilterPasses(params: IDoesFilterPassParams, filterModel: IAbstractSimpleModel) {

        const cellValue: any = this.scalarFilterParams.valueGetter(params.node);

        const range = this.mapRangeFromModel(filterModel);

        const filterValue = range.from;
        const filterValueTo = range.to;
        const filterType = filterModel.type;

        const customFilterOption = this.optionsFactory.getCustomOption(filterType);
        if (customFilterOption) {
            // only execute the custom filter if a value exists or a value isn't required, i.e. input is hidden
            if (filterValue != null || customFilterOption.hideFilterInput) {
                return customFilterOption.test(filterValue, cellValue);
            }
        }

        // why this? looks like logic that should be in parent class????
        // if (filterValue == null) {
        //     return type === FilterConditionType.MAIN ? true : this.conditionValue === 'AND';
        // }

        const compareResult = this.nullComparator(filterType, filterValue, cellValue);

        if (filterType === AbstractScalerFilter.EMPTY) {
            return false;
        }

        if (filterType === AbstractScalerFilter.EQUALS) {
            return compareResult === 0;
        }

        if (filterType === AbstractScalerFilter.GREATER_THAN) {
            return compareResult > 0;
        }

        if (filterType === AbstractScalerFilter.GREATER_THAN_OR_EQUAL) {
            return compareResult >= 0;
        }

        if (filterType === AbstractScalerFilter.LESS_THAN_OR_EQUAL) {
            return compareResult <= 0;
        }

        if (filterType === AbstractScalerFilter.LESS_THAN) {
            return compareResult < 0;
        }

        if (filterType === AbstractScalerFilter.NOT_EQUAL) {
            return compareResult != 0;
        }

        // From now on the type is a range and rawFilterValues must be an array!
        const compareToResult = this.nullComparator(filterType, filterValueTo, cellValue);
        if (filterType === AbstractScalerFilter.IN_RANGE) {
            if (!this.scalarFilterParams.inRangeInclusive) {
                return compareResult > 0 && compareToResult < 0;
            } else {
                return compareResult >= 0 && compareToResult <= 0;
            }
        }

        throw new Error('Unexpected type of filter: ' + filterType);
    }
}