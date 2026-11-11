/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_create_sabatier_material_api_sabatier_materials_post */
export interface BodyCreateSabatierMaterialApiSabatierMaterialsPost {
  /**
   * Material Name
   * название материала
   * @maxLength 128
   */
  material_name: string;
  /**
   * Material Image
   * изображение материала
   */
  material_image?: File | Blob | null;
  /**
   * Material Video
   * короткое видео материала
   */
  material_video?: File | Blob | null;
}

/** ChemistUserLoginIn */
export interface ChemistUserLoginIn {
  /**
   * Chemist Login
   * @minLength 1
   * @maxLength 64
   */
  chemist_login: string;
  /**
   * Chemist Password
   * @minLength 1
   * @maxLength 128
   */
  chemist_password: string;
}

/** ChemistUserOut */
export interface ChemistUserOut {
  /** Id */
  id: number;
  /** Chemist Login */
  chemist_login: string;
  /** Full Name */
  full_name: string;
  /** Is Moderator */
  is_moderator: boolean;
}

/** ChemistUserRegisterIn */
export interface ChemistUserRegisterIn {
  /**
   * Chemist Login
   * @minLength 1
   * @maxLength 64
   */
  chemist_login: string;
  /**
   * Chemist Password
   * @minLength 1
   * @maxLength 128
   */
  chemist_password: string;
  /**
   * Full Name
   * @minLength 1
   * @maxLength 128
   */
  full_name: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** MaterialLikeIn */
export interface MaterialLikeIn {
  /**
   * Liked
   * @min 0
   * @max 1
   */
  liked: number;
}

/** SabatierMaterialOut */
export interface SabatierMaterialOut {
  /** Id */
  id: number;
  /** Material Name */
  material_name: string;
  /** Material Description */
  material_description: string | null;
  /** Material Image Name */
  material_image_name: string;
  /** Material Video Name */
  material_video_name: string;
  /** Min Reaction Value */
  min_reaction_value: number | null;
  /** Molar Mass */
  molar_mass: number | null;
  /** Liked Count */
  liked_count: number;
  /**
   * Is Mine
   * @default 0
   */
  is_mine?: number;
  /**
   * Is Liked
   * @default 0
   */
  is_liked?: number;
}

/** SabatierMaterialPublishIn */
export interface SabatierMaterialPublishIn {
  /**
   * Material Description
   * @maxLength 1024
   */
  material_description: string;
  /**
   * Min Reaction Value
   * @min 0
   */
  min_reaction_value: number;
  /**
   * Molar Mass
   * @exclusiveMin 0
   */
  molar_mass: number;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Sabatier Methane Synthesis API
 * @version 4.0
 *
 *
 * Веб-сервис заявочной системы по теме «Синтез метана по реакции Сабатье».
 * Услуги системы — материалы реакции, то есть исходные вещества для синтеза метана.
 *
 * **Авторизация.** Метод аутентификации проверяет логин и пароль по таблице
 * пользователей и сохраняет сессию в Redis, а её идентификатор отдаёт браузеру
 * в куке `session_id`. Каждый защищённый метод берёт эту куку, находит по ней
 * сессию в Redis и получает ид пользователя: нет сессии — `401`,
 * чужой материал — `403`.
 *
 * **Права.** Без аутентификации доступно только чтение данных: список материалов
 * и лента. Методы создателя — добавление, публикация, удаление, лайк
 * и получение черновика — требуют действующей сессии. Создатель материала
 * подставляется автоматически из сессии, с клиента его передать нельзя.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  sabatierMaterials = {
    /**
     * @description Только опубликованные материалы, удалённые наружу не передаются. Фильтр `min_reaction_value` выполняется в SQL-запросе на бэкенде. Метод чтения: доступен и гостю, и создателю. Для гостя `is_mine` и `is_liked` всегда 0, для авторизованного пользователя считаются по его сессии.
     *
     * @tags Материалы реакции
     * @name GetSabatierMaterials
     * @summary Список материалов с фильтрацией
     * @request GET:/api/sabatier_materials
     */
    getSabatierMaterials: (
      query?: {
        /**
         * Min Reaction Value
         * минимальная масса вещества для типовой реакции, г
         * @min 0
         * @default 0
         */
        min_reaction_value?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SabatierMaterialOut[], HTTPValidationError>({
        path: `/api/sabatier_materials`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик: кнопкой «Далее» заполняется только название. Создатель подставляется автоматически из сессии, с клиента его передать нельзя. Файлы необязательные: присланные уходят в MinIO под именами на латинице, в БД сохраняются только имена; без них остаются медиа по умолчанию с SSR-сервера. Метод создателя: гостю — 401.
     *
     * @tags Материалы реакции
     * @name CreateSabatierMaterial
     * @summary Добавление материала
     * @request POST:/api/sabatier_materials
     * @secure
     */
    createSabatierMaterial: (
      data: BodyCreateSabatierMaterialApiSabatierMaterialsPost,
      params: RequestParams = {},
    ) =>
      this.request<SabatierMaterialOut, void | HTTPValidationError>({
        path: `/api/sabatier_materials`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Черновик пользователя из сессии, ид не указывается: черновик не более одного. Описание и оба поля по предметной области у него ещё `null` — их заполняет публикация. Метод создателя: гостю — 401.
     *
     * @tags Материалы реакции
     * @name GetSabatierMaterialDraft
     * @summary Черновик текущего пользователя
     * @request GET:/api/sabatier_materials/draft
     * @secure
     */
    getSabatierMaterialDraft: (params: RequestParams = {}) =>
      this.request<SabatierMaterialOut, void>({
        path: `/api/sabatier_materials/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Из БД читается ровно одна строка. Без `material_id` отдаёт первый опубликованный материал, с `material_id` — указанный, а вместе с `next=true` — следующий опубликованный за ним. Следующий ищет СУБД: ид могут идти с пропусками, за последним материалом лента возвращается к первому. Метод чтения, доступен и гостю.
     *
     * @tags Материалы реакции
     * @name GetSabatierMaterialFeed
     * @summary Лента материалов
     * @request GET:/api/sabatier_materials/feed
     */
    getSabatierMaterialFeed: (
      query?: {
        /**
         * Material Id
         * ид материала, с которого продолжается лента
         */
        material_id?: number | null;
        /**
         * Next
         * вернуть следующий материал за указанным ид
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SabatierMaterialOut, void | HTTPValidationError>({
        path: `/api/sabatier_materials/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Заполняет краткое описание и оба поля по предметной области и переводит черновик в статус «опубликован». Статус с клиента не передаётся, дату формирования ставит бэкенд. Статусы меняются только вперёд: повторный вызов вернёт 404, вернуть материал в черновик нечем. Метод создателя: гостю — 401, на чужой материал — 403.
     *
     * @tags Материалы реакции
     * @name PublishSabatierMaterial
     * @summary Публикация материала
     * @request PUT:/api/sabatier_materials/{material_id}/publish
     * @secure
     */
    publishSabatierMaterial: (
      materialId: number,
      data: SabatierMaterialPublishIn,
      params: RequestParams = {},
    ) =>
      this.request<SabatierMaterialOut, void | HTTPValidationError>({
        path: `/api/sabatier_materials/${materialId}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Только логическое удаление: статус меняется на «удалён», строка в БД остаётся. После него материал пропадает и из списка, и из ленты. Метод создателя: гостю — 401, на чужой материал — 403.
     *
     * @tags Материалы реакции
     * @name DeleteSabatierMaterial
     * @summary Удаление материала
     * @request DELETE:/api/sabatier_materials/{material_id}
     * @secure
     */
    deleteSabatierMaterial: (materialId: number, params: RequestParams = {}) =>
      this.request<void, void | HTTPValidationError>({
        path: `/api/sabatier_materials/${materialId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description `liked` = 1 ставит лайк от пользователя из сессии, 0 — отменяет. Лайкать можно любой опубликованный материал, в том числе чужой, поэтому 403 здесь нет. В ответе видно новые `liked_count` и `is_liked`. Гостю — 401.
     *
     * @tags Материалы реакции
     * @name LikeSabatierMaterial
     * @summary Лайк материала
     * @request POST:/api/sabatier_materials/{material_id}/like
     * @secure
     */
    likeSabatierMaterial: (
      materialId: number,
      data: MaterialLikeIn,
      params: RequestParams = {},
    ) =>
      this.request<SabatierMaterialOut, void | HTTPValidationError>({
        path: `/api/sabatier_materials/${materialId}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
