import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * A reusable loading spinner component.
 *
 * This component displays a simple animated spinner
 * to indicate that a process or request is currently in progress.
 *
 * It can be customized in size, color, and visibility using the provided inputs.
 *
 * @example
 * ```html
 * <app-spinner 
 *   [size]="40" 
 *   [color]="'#ff0000'" 
 *   [loading]="isLoading">
 * </app-spinner>
 * ```
 */
@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class SpinnerComponent {
    /**
     * The diameter (in pixels) of the spinner.
     * @default 30
     */
    @Input() size: number = 30;

    /**
     * The color of the spinner in any valid CSS color format (e.g. hex, rgb, or named color).
     * @default '#3498db'
     */
    @Input() color: string = '#3498db';

    /**
     * Controls whether the spinner is visible.
     * Set to `true` to show the spinner, or `false` to hide it.
     * @default false
     */
    @Input() loading: boolean = false;

    /**
     * Used to indicate if the spinner is being displayed
     * during a login validation process.
     * Can be used for conditional styling or animation.
     * @default false
     */
    @Input() loginValidate: boolean = false;
}
